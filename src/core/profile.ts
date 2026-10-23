// Opt-in diagnostics only. No timings enter manifests, results, or engine import closures.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { threadId } from "node:worker_threads";

const directory = process.env.LVRTC_PROFILE_DIR;
const events: { phase: string; start: number; ms: number }[] = [];
export function profileStart(phase: string): () => void {
  if (!directory) return () => {};
  const start = performance.timeOrigin + performance.now();
  return () => events.push({ phase, start, ms: performance.timeOrigin + performance.now() - start });
}
export function profileSync<T>(phase: string, act: () => T): T {
  const end = profileStart(phase);
  try {
    return act();
  } finally {
    end();
  }
}
export async function profileAsync<T>(phase: string, act: () => Promise<T>): Promise<T> {
  const end = profileStart(phase);
  try {
    return await act();
  } finally {
    end();
  }
}
if (directory)
  process.on("exit", () => {
    mkdirSync(directory, { recursive: true });
    writeFileSync(
      join(directory, `${process.pid}${threadId ? `-thread${threadId}` : ""}.json`),
      JSON.stringify({ pid: process.pid, maxRssKiB: process.resourceUsage().maxRSS, events }),
    );
  });
