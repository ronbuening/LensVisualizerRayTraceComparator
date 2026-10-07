import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

import packageJson from "../package.json" with { type: "json" };
import { EXIT_FAILURE, EXIT_OK, EXIT_USAGE, runCli, type CliCommand } from "../src/cli/main.ts";

function capture() {
  const out: string[] = [];
  const err: string[] = [];
  return {
    io: { stdout: (text: string) => void out.push(text), stderr: (text: string) => void err.push(text) },
    out: () => out.join(""),
    err: () => err.join(""),
  };
}

const echo: CliCommand = {
  name: "echo",
  summary: "Print the arguments",
  run: async (args, io) => {
    io.stdout(`${args.join(" ")}\n`);
    return EXIT_OK;
  },
};

const boom: CliCommand = {
  name: "boom",
  summary: "Always throws",
  run: async () => {
    throw new Error("kaboom");
  },
};

test("help lists registered commands and exits 0", async () => {
  const sink = capture();
  assert.equal(await runCli(["--help"], sink.io, [echo]), EXIT_OK);
  assert.match(sink.out(), /Usage: lvrtc <command>/);
  assert.match(sink.out(), /echo {2}Print the arguments/);
});

test("no arguments shows help", async () => {
  const sink = capture();
  assert.equal(await runCli([], sink.io, []), EXIT_OK);
  assert.match(sink.out(), /\(none yet\)/);
});

test("--version prints the package version", async () => {
  const sink = capture();
  assert.equal(await runCli(["--version"], sink.io), EXIT_OK);
  assert.equal(sink.out(), `${packageJson.version}\n`);
});

test("a command receives the remaining arguments", async () => {
  const sink = capture();
  assert.equal(await runCli(["echo", "a", "b"], sink.io, [echo]), EXIT_OK);
  assert.equal(sink.out(), "a b\n");
});

test("an unknown command is a usage error", async () => {
  const sink = capture();
  assert.equal(await runCli(["nope"], sink.io, [echo]), EXIT_USAGE);
  assert.match(sink.err(), /unknown command "nope"/);
});

test("a throwing command reports its message and exits 1", async () => {
  const sink = capture();
  assert.equal(await runCli(["boom"], sink.io, [boom]), EXIT_FAILURE);
  assert.equal(sink.err(), "lvrtc boom: kaboom\n");
});

test("bin/lvrtc.mjs runs under plain node with no flags", () => {
  const bin = fileURLToPath(new URL("../bin/lvrtc.mjs", import.meta.url));
  const output = execFileSync(process.execPath, [bin, "--version"], { encoding: "utf8" });
  assert.equal(output, `${packageJson.version}\n`);
});
