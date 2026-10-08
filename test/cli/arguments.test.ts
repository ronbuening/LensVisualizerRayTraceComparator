import assert from "node:assert/strict";
import { test } from "node:test";

import { parseArguments } from "../../src/cli/arguments.ts";
import { parseTargetArguments } from "../../src/cli/runTarget.ts";
import { UsageError } from "../../src/core/usageError.ts";

const parse = (...args: string[]) => parseArguments(args, ["--root", "--zoom"], ["--json"]);

test("positionals, values and flags are told apart in any order", () => {
  const parsed = parse("show", "--json", "--root", "some/dir", "a-key", "--zoom", "0.5");
  assert.deepEqual(parsed.positionals, ["show", "a-key"]);
  assert.deepEqual(
    [...parsed.values],
    [
      ["--root", "some/dir"],
      ["--zoom", "0.5"],
    ],
  );
  assert.deepEqual([...parsed.flags], ["--json"]);
});

test("a value may follow its option after an equals sign", () => {
  assert.equal(parse("--root=some/dir").values.get("--root"), "some/dir");
  assert.equal(parse("--root=a=b").values.get("--root"), "a=b", "only the first equals sign separates");
  assert.equal(parse("--zoom=-0.5").values.get("--zoom"), "-0.5");
  assert.equal(parse("--zoom", "-0.5").values.get("--zoom"), "-0.5");
  assert.equal(parse("--root=--odd").values.get("--root"), "--odd", "after the equals sign anything is a value");
  assert.deepEqual(parse("key=value").positionals, ["key=value"], "a word that is not an option is left alone");
});

test("what cannot be read is a usage error", () => {
  const refused = (args: string[], message: string): void => {
    assert.throws(
      () => parse(...args),
      (error: unknown) => error instanceof UsageError && error.message === message,
      args.join(" "),
    );
  };
  refused(["--root"], "--root needs a value");
  refused(["--root="], "--root needs a value");
  refused(["--root", "--json"], "--root needs a value");
  refused(["--root", "a", "--root=b"], "--root is given more than once");
  refused(["--nope"], 'unknown option "--nope"');
  refused(["--nope=1"], 'unknown option "--nope=1"');
  refused(["--json=1"], 'unknown option "--json=1"');
  refused(["-x"], 'unknown option "-x"');
});

test("a command that names a run takes --root=<dir> as well", () => {
  const asked = parseTargetArguments(["fake-pair", "--root=test/fixtures/fake-root"], ["--root"], []);
  assert.equal(asked.target, "fake-pair");
  assert.equal(asked.values.get("--root"), "test/fixtures/fake-root");
});
