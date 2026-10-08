import assert from "node:assert/strict";
import { linkSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { TEMP_SUFFIX, writeFileAtomic } from "../../src/core/atomicFile.ts";
import { tempDir } from "./support.ts";

test("a file is written whole, with the directories it needs, and nothing is left beside it", (t) => {
  const directory = tempDir(t);
  const path = join(directory, "a", "b", "entry.json");
  writeFileAtomic(path, '{"x":1}\n');
  assert.equal(readFileSync(path, "utf8"), '{"x":1}\n');
  assert.deepEqual(readdirSync(join(directory, "a", "b")), ["entry.json"]);
});

test("a file that is there is replaced, and still nothing is left beside it", (t) => {
  const directory = tempDir(t);
  const path = join(directory, "entry.json");
  writeFileAtomic(path, "first, and the longer of the two\n");
  writeFileAtomic(path, "second\n");
  assert.equal(readFileSync(path, "utf8"), "second\n");
  assert.deepEqual(readdirSync(directory), ["entry.json"]);
});

test("a file is replaced by another file, never rewritten: whoever holds the old one still reads all of it", (t) => {
  const directory = tempDir(t);
  const path = join(directory, "entry.json");
  writeFileAtomic(path, "the old text, whole\n");
  // A second name for the old file shows what becomes of its bytes. Written in place, they would be the new text,
  // and for a moment a part of it; renamed over, the old file is untouched and only the name moves.
  const held = join(directory, "held.json");
  linkSync(path, held);
  writeFileAtomic(path, "new\n");
  assert.equal(readFileSync(path, "utf8"), "new\n");
  assert.equal(readFileSync(held, "utf8"), "the old text, whole\n");
  assert.deepEqual(readdirSync(directory).sort(), ["entry.json", "held.json"]);
});

test("text is written as UTF-8", (t) => {
  const path = join(tempDir(t), "entry.txt");
  writeFileAtomic(path, "λ = 587.5618 nm — d\n");
  assert.deepEqual(readFileSync(path), Buffer.from("λ = 587.5618 nm — d\n", "utf8"));
});

test("a write that fails throws, removes its temporary file and leaves what was there", (t) => {
  const directory = tempDir(t);
  // A directory that is not empty cannot be renamed over: the write gets as far as its last step and fails there.
  const path = join(directory, "taken");
  mkdirSync(path);
  writeFileSync(join(path, "kept.txt"), "kept");
  assert.throws(() => writeFileAtomic(path, "text\n"));
  assert.deepEqual(readdirSync(directory), ["taken"]);
  assert.deepEqual(readdirSync(path), ["kept.txt"]);
});

test("a temporary file a killed writer left is not the file, and does not stop the next write", (t) => {
  const directory = tempDir(t);
  const path = join(directory, "entry.json");
  const left = `entry.json.12345.0123456789ab${TEMP_SUFFIX}`;
  writeFileSync(join(directory, left), '{"x":');
  writeFileAtomic(path, '{"x":2}\n');
  assert.equal(readFileSync(path, "utf8"), '{"x":2}\n');
  assert.deepEqual(readdirSync(directory).sort(), ["entry.json", left].sort());
});
