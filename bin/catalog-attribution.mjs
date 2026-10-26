#!/usr/bin/env node
// Inspect one temporary catalog reproducer. No engine or owner-run artifacts are written.
import { spawnSync } from "node:child_process";
import { realpathSync } from "node:fs";
import { join, relative, sep } from "node:path";

import { REPO_ROOT, loadConfig } from "../src/core/config.ts";
import { optilandWorkerEnvironment } from "../src/engines/optiland/definition.ts";
import { workerEnvironment } from "../src/transports/stdio.ts";

const [directory, ...extra] = process.argv.slice(2);
if (!directory || extra.length) throw new Error("Usage: node bin/catalog-attribution.mjs <temporary LVRTC_RUNS_DIR>");
const input = realpathSync(directory);
const withinOwnerRuns = relative(join(REPO_ROOT, "runs"), input);
if (!withinOwnerRuns.startsWith(`..${sep}`) && withinOwnerRuns !== "..")
  throw new Error("Use a temporary reproduction, never the owner's runs directory");
const { config } = loadConfig({ rootDir: REPO_ROOT, env: process.env });
if (!config.engines.optiland.python) throw new Error("Set LVRTC_OPTILAND_PYTHON to the optiland interpreter");
const result = spawnSync(config.engines.optiland.python, ["-m", "diagnostics.catalog", input], {
  cwd: REPO_ROOT,
  env: workerEnvironment(process.env, {}, optilandWorkerEnvironment(config.cacheDir)),
  stdio: "inherit",
});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
