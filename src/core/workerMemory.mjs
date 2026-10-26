// Pool-only preload for Node stdio stand-ins. Does not enter an engine's import closure.
import { writeFileSync, renameSync } from "node:fs";
import { join } from "node:path";

const target = join(process.env.LVRTC_POOL_MEMORY_DIR, `${process.pid}.json`);
let peakRssBytes = 0;
const report = (exited = false) => {
  const rssBytes = process.memoryUsage().rss;
  peakRssBytes = Math.max(peakRssBytes, rssBytes);
  writeFileSync(
    `${target}.tmp`,
    JSON.stringify({ pid: process.pid, parent: process.ppid, rssBytes, peakRssBytes, exited }),
  );
  renameSync(`${target}.tmp`, target);
};
report();
setInterval(report, 250).unref();
process.on("exit", () => report(true));
