// Controller-only RSS sampling. No engine protocol, fingerprints, results, or machine free-memory heuristic.
import { execFile } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { promisify } from "node:util";
import { setTimeout as delay } from "node:timers/promises";

const execute = promisify(execFile);
let profileNumber = 0;
export interface MemoryChild {
  readonly pid: number;
  readonly rssBytes: number;
}
export interface SlotMemory {
  readonly pid: number;
  readonly nodeRssBytes: number;
  readonly workers: readonly { readonly pid: number; readonly rssBytes: number; readonly peakRssBytes?: number }[];
}
export type MemoryReader = (children: readonly MemoryChild[]) => Promise<readonly SlotMemory[]>;

/** All descendants count, including both optiland workers for R6c. ps RSS is KiB on macOS and Linux. */
export const readPoolMemory: MemoryReader = async (children) => {
  if (children.length === 0) return [];
  const { stdout } = await execute("ps", ["-axo", "pid=,ppid=,rss="], { timeout: 5_000, maxBuffer: 16 * 1024 * 1024 });
  return processTreeMemory(children, stdout);
};

/** Interpreter-owned heartbeats work even where the host sandbox prohibits inspecting other processes. */
export function heartbeatMemoryReader(directory: string): MemoryReader {
  return async (children) => {
    if (existsSync(join(directory, "needs-ps"))) return readPoolMemory(children);
    const workers = readdirSync(directory)
      .filter((name) => name.endsWith(".json"))
      .map(
        (name) =>
          JSON.parse(readFileSync(join(directory, name), "utf8")) as {
            pid: number;
            parent: number;
            rssBytes: number;
            peakRssBytes: number;
            exited?: boolean;
          },
      );
    return children.map((child) => ({
      pid: child.pid,
      nodeRssBytes: child.rssBytes,
      workers: workers
        .filter((worker) => worker.parent === child.pid)
        .map((worker) => ({
          pid: worker.pid,
          rssBytes: worker.exited ? 0 : worker.rssBytes,
          peakRssBytes: worker.peakRssBytes,
        })),
    }));
  };
}

export function processTreeMemory(children: readonly MemoryChild[], table: string): readonly SlotMemory[] {
  const rows = table
    .trim()
    .split("\n")
    .map((line) => {
      const [pid, parent, rss] = line.trim().split(/\s+/).map(Number);
      return { pid, parent, rssBytes: rss * 1024 };
    })
    .filter((row) => Number.isSafeInteger(row.pid) && Number.isFinite(row.rssBytes));
  return children.map((child) => {
    const descendants = new Set([child.pid]);
    let size: number;
    do {
      size = descendants.size;
      for (const row of rows) if (descendants.has(row.parent)) descendants.add(row.pid);
    } while (size !== descendants.size);
    return {
      pid: child.pid,
      // A child reports its own RSS, including after synchronous work. ps also catches growth while JS is busy.
      nodeRssBytes: Math.max(child.rssBytes, rows.find((row) => row.pid === child.pid)?.rssBytes ?? 0),
      workers: rows
        .filter((row) => row.pid !== child.pid && descendants.has(row.pid))
        .map(({ pid, rssBytes }) => ({ pid, rssBytes })),
    };
  });
}

/** Pressure delays dispatch only. Running work and ordered result publication always continue. */
export function createMemoryGuard(options: {
  readonly budgetBytes: number;
  readonly children: () => readonly MemoryChild[];
  readonly reader?: MemoryReader;
  readonly sampleMs?: number;
}) {
  const reader = options.reader ?? readPoolMemory;
  const sampleMs = options.sampleMs ?? 250;
  let stopped = false;
  let current = 0;
  let readable = false;
  let pending: Promise<void> | undefined;
  let peakSumBytes = 0;
  let samples = 0;
  let pauses = 0;
  let readFailures = 0;
  const peaks = new Map<
    number,
    {
      pid: number;
      peakNodeRssBytes: number;
      peakWorkersRssBytes: number;
      peakSumBytes: number;
      workers: Map<number, number>;
    }
  >();
  const sample = (): Promise<void> =>
    (pending ??= (async () => {
      try {
        const slots = await reader(options.children());
        current = 0;
        for (const slot of slots) {
          const workerSum = slot.workers.reduce((sum, worker) => sum + worker.rssBytes, 0);
          const sum = slot.nodeRssBytes + workerSum;
          current += sum;
          const peak = peaks.get(slot.pid) ?? {
            pid: slot.pid,
            peakNodeRssBytes: 0,
            peakWorkersRssBytes: 0,
            peakSumBytes: 0,
            workers: new Map(),
          };
          peak.peakNodeRssBytes = Math.max(peak.peakNodeRssBytes, slot.nodeRssBytes);
          peak.peakWorkersRssBytes = Math.max(peak.peakWorkersRssBytes, workerSum);
          peak.peakSumBytes = Math.max(peak.peakSumBytes, sum);
          for (const worker of slot.workers)
            peak.workers.set(
              worker.pid,
              Math.max(peak.workers.get(worker.pid) ?? 0, worker.peakRssBytes ?? worker.rssBytes),
            );
          peaks.set(slot.pid, peak);
        }
        peakSumBytes = Math.max(peakSumBytes, current);
        samples++;
        readable = true;
      } catch {
        // An unreadable process table must not silently omit Python memory; retry without changing any result.
        readable = false;
        readFailures++;
      }
    })().finally(() => {
      pending = undefined;
    }));
  const timer = setInterval(() => {
    void sample();
  }, sampleMs);
  timer.unref();
  return {
    async wait(): Promise<void> {
      await sample();
      let paused = false;
      while (!stopped && (!readable || current > options.budgetBytes)) {
        if (!paused) {
          pauses++;
          paused = true;
        }
        await delay(sampleMs);
        await sample();
      }
    },
    async close(): Promise<void> {
      stopped = true;
      clearInterval(timer);
      await sample();
      const directory = process.env.LVRTC_PROFILE_DIR;
      if (!directory) return;
      mkdirSync(directory, { recursive: true });
      writeFileSync(
        join(directory, `pool-memory-${process.pid}-${++profileNumber}.json`),
        JSON.stringify({
          budgetBytes: options.budgetBytes,
          sampleMs,
          peakSumBytes,
          samples,
          pauses,
          readFailures,
          slots: [...peaks.values()].map(({ workers, ...peak }) => ({
            ...peak,
            workers: [...workers].map(([pid, peakRssBytes]) => ({ pid, peakRssBytes })),
          })),
        }),
      );
    },
  };
}
