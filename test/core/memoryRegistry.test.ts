// The registry a pool worker builds its engines with: how the memory of each kind of worker is to be measured. Making
// an adapter starts nothing, so no pool is run here.
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { loadConfig } from "../../src/core/config.ts";
import { memoryRegistry } from "../../src/core/memoryRegistry.ts";
import { FAKE_ROOT, tempDir } from "./support.ts";

test("a one-shot engine of a pool worker is measured by the process table; a Python stdio worker is not", async (t) => {
  const loaded = loadConfig({ rootDir: FAKE_ROOT, env: { LVRTC_PYTHON: "python3" } });

  const stdio = tempDir(t);
  const python = await memoryRegistry(loaded, stdio).create("fake-py");
  await python.close();
  // A Python stdio worker reports its own memory, through the launcher it is started with.
  assert.equal(existsSync(join(stdio, "needs-ps")), false);

  const oneshot = tempDir(t);
  const once = await memoryRegistry(loaded, oneshot).create("fake-py-oneshot");
  await once.close();
  // A process per message, started as it is configured: the process table sees each while it runs.
  assert.equal(existsSync(join(oneshot, "needs-ps")), true);
});

test("a file-exchange engine of a pool worker starts no process, so there is nothing of it to measure", async (t) => {
  const runsDir = join(tempDir(t), "runs");
  const loaded = loadConfig({ rootDir: FAKE_ROOT, env: { LVRTC_RUNS_DIR: runsDir } });
  const directory = tempDir(t);
  const human = await memoryRegistry(loaded, directory).create("fake-human");
  assert.equal((await human.describe()).identity.id, "fake-human");
  await human.close();
  assert.equal(existsSync(join(directory, "needs-ps")), false);
});
