// Result-only Stage 4.2 helper. Every engine MTF in its table comes from lvrtc run, not this script.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { REPO_ROOT, loadConfig } from "../src/core/config.ts";
import {
  investigationSuite,
  investigationTable,
  lvGridDiagnostic,
  readInvestigation,
} from "../src/diagnostics/z50f12.ts";
import { optilandWorkerEnvironment } from "../src/engines/optiland/definition.ts";

const [mode, stated] = process.argv.slice(2);
if (!stated || !["suite", "table", "lv-grid", "optiland-grid", "sampling"].includes(mode)) {
  throw new Error(
    "Usage: node bin/z50f12-investigation.mjs suite|table|sampling|lv-grid|optiland-grid <temporary directory>",
  );
}
const directory = resolve(stated);
const config = loadConfig({ rootDir: REPO_ROOT, env: process.env }).config;
if (mode === "suite") {
  mkdirSync(directory, { recursive: true });
  const suite = investigationSuite(JSON.parse(readFileSync(join(REPO_ROOT, "suites/benchmark.json"), "utf8")));
  writeFileSync(join(directory, "suite.json"), JSON.stringify(suite, null, 2) + "\n");
} else if (mode === "table") {
  process.stdout.write(investigationTable(join(directory, "runs")));
} else if (mode === "lv-grid") {
  process.stdout.write(JSON.stringify(await lvGridDiagnostic(join(directory, "runs"), config.lvPath), null, 2) + "\n");
} else if (mode === "sampling") {
  const { manifest, answer } = readInvestigation(join(directory, "runs"));
  const rows = manifest.runs.flatMap((run) =>
    ["lv", "wave", "optiland", "optiland-wave"].flatMap((engine) =>
      answer(run.name, engine).data.fields.map(({ field, status, reason, sampling }) => ({
        run: run.name,
        engine,
        field,
        status,
        reason,
        sampling,
      })),
    ),
  );
  process.stdout.write(JSON.stringify(rows, null, 2) + "\n");
} else {
  if (config.engines.optiland.python === null) throw new Error("optiland interpreter not configured");
  const result = spawnSync(
    config.engines.optiland.python,
    ["-B", "-m", "diagnostics.z50f12", join(directory, "runs/z50f12-investigation")],
    {
      env: { ...process.env, ...optilandWorkerEnvironment(config.cacheDir) },
      encoding: "utf8",
      stdio: ["ignore", "pipe", "inherit"],
      maxBuffer: 8 * 1024 * 1024,
    },
  );
  process.stderr.write(result.stderr ?? "");
  if (result.status !== 0) throw new Error(result.error?.message ?? `diagnostic exit ${result.status}`);
  process.stdout.write(result.stdout);
}
