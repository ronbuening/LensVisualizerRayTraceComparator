// Who the engines are, for the staleness of a baseline's records: as a run recorded them (its manifest's
// `engines`), or as they say now, asked once in a child `lvrtc engine describe` so that no engine (LensVisualizer,
// optiland) is ever loaded in the dashboard's own process. What is asked is kept in memory and never written.
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

import type { ManifestEngine, RunManifest } from "../core/manifest.ts";

/** The command line of this repository, which the child is started with. */
const BIN: string = fileURLToPath(new URL("../../bin/lvrtc.mjs", import.meta.url));

/** What a child `lvrtc engine describe` ended with: its exit code and what it printed to its output. */
export interface DescribeOutcome {
  readonly code: number | null;
  readonly stdout: string;
}

/**
 * Runs `lvrtc engine describe <ids>... --json` somehow: a child process, or a script in a test. `signal` aborts it
 * (the dashboard closes while the engines are still being asked).
 */
export type EngineDescribeRunner = (ids: readonly string[], signal?: AbortSignal) => Promise<DescribeOutcome>;

/** What the engines said when they were asked: not asked (`--no-ask`), being asked, their answer, or why none. */
export type AskedEngines =
  | { readonly state: "not-asked" }
  | { readonly state: "asking" }
  | { readonly state: "asked"; readonly engines: readonly ManifestEngine[] }
  | { readonly state: "failed"; readonly problem: string };

/**
 * The runner that starts `process.execPath bin/lvrtc.mjs engine describe <ids>... --root <root> --json` as a child
 * with the environment given (the dashboard's own), and collects its output. The child's error stream is the
 * dashboard's own, so that an engine that fails to load (LensVisualizer, optiland) is seen on the console; nothing of
 * it is kept. An abort ends the child.
 */
export function childDescribeRunner(
  rootDir: string,
  env: Readonly<Record<string, string | undefined>>,
): EngineDescribeRunner {
  return (ids, signal) =>
    new Promise((resolve) => {
      const child = spawn(process.execPath, [BIN, "engine", "describe", ...ids, "--root", rootDir, "--json"], {
        env: { ...env },
        stdio: ["ignore", "pipe", "inherit"],
        ...(signal === undefined ? {} : { signal }),
      });
      const chunks: Buffer[] = [];
      child.stdout.on("data", (chunk: Buffer) => chunks.push(chunk));
      child.on("error", () => resolve({ code: null, stdout: "" }));
      child.on("close", (code) => resolve({ code, stdout: Buffer.concat(chunks).toString("utf8") }));
    });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Whether a value is a `ManifestEngine` of the id `id`, as a manifest records one. */
function isManifestEngine(value: unknown, id: string): value is ManifestEngine {
  if (!isRecord(value) || value.id !== id) return false;
  if (value.status === "unavailable") return typeof value.code === "string";
  return (
    value.status === "available" &&
    typeof value.version === "string" &&
    typeof value.fingerprint === "string" &&
    (value.adapterRevision === undefined || typeof value.adapterRevision === "string") &&
    isRecord(value.details)
  );
}

/**
 * What `lvrtc engine describe <ids>... --json` printed, read: one `ManifestEngine` per id, in the order asked, or
 * why the output is not that, in words that quote nothing the child said.
 */
export function parseDescribeOutput(
  stdout: string,
  ids: readonly string[],
): { readonly engines: readonly ManifestEngine[] } | { readonly problem: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(stdout);
  } catch {
    return { problem: "its output is not JSON" };
  }
  if (!isRecord(parsed) || !Array.isArray(parsed.engines)) return { problem: "its output lists no engines" };
  const engines = parsed.engines as unknown[];
  if (engines.length !== ids.length || engines.some((engine, index) => !isManifestEngine(engine, ids[index]))) {
    return { problem: "its output is not one engine of each id asked, in order" };
  }
  return { engines: engines as ManifestEngine[] };
}

/**
 * Asks the engines `ids` who they are, once, through `runner`: every id, in the order given, or why they could not
 * be asked. No engine is asked for no id.
 */
export async function askEngines(
  runner: EngineDescribeRunner,
  ids: readonly string[],
  signal?: AbortSignal,
): Promise<AskedEngines> {
  if (ids.length === 0) return { state: "asked", engines: [] };
  let outcome: DescribeOutcome;
  try {
    outcome = await runner(ids, signal);
  } catch {
    return { state: "failed", problem: "the child could not be run" };
  }
  if (outcome.code !== 0) {
    return {
      state: "failed",
      problem: `the child ended with exit code ${outcome.code === null ? "none" : outcome.code}`,
    };
  }
  const read = parseDescribeOutput(outcome.stdout, ids);
  return "problem" in read ? { state: "failed", problem: read.problem } : { state: "asked", engines: read.engines };
}

/** The engines a run recorded: who each said it was when the suite last ran, or why it could not be used. */
export function recordedEngines(manifest: RunManifest): readonly ManifestEngine[] {
  return manifest.engines;
}
