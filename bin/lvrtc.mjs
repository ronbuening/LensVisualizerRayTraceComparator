#!/usr/bin/env node
// Entry point. Node's native type stripping loads the TypeScript sources directly; there is no build step.
import { runCli } from "../src/cli/main.ts";

// A reader that stops early (`lvrtc lenses list | head`) closes the pipe: that is not a failure of the command.
process.stdout.on("error", (error) => {
  if (error.code !== "EPIPE") throw error;
});

process.exitCode = await runCli(process.argv.slice(2), {
  stdout: (text) => process.stdout.write(text),
  stderr: (text) => process.stderr.write(text),
});
