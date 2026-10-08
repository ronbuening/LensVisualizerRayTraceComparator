// What the hermetic tests of the engine `optiland` share: a fake optiland that any Python can import, behind an
// "interpreter" that puts it on the path. Nothing here needs optiland, numpy or numba.
import { chmodSync, cpSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { TestContext } from "node:test";
import { fileURLToPath } from "node:url";

import { CONFIG_FILE, loadConfig } from "../../../src/core/config.ts";
import type { LoadedConfig } from "../../../src/core/config.ts";
import { tempDir } from "../../core/support.ts";
import { PYTHON, PYTHON_MISSING } from "../support.ts";

/** The fake optiland: a directory of packages named `optiland`, `numpy`, `scipy` and `numba`. */
export const FAKE_OPTILAND_SITE: string = fileURLToPath(new URL("../../fixtures/fake-optiland/site", import.meta.url));

/**
 * Why the tests that run the worker on the fake optiland are skipped, or false when they can run: they need the
 * Python the kit needs, and a shell to be the interpreter's wrapper.
 */
export const FAKE_OPTILAND_MISSING: string | false =
  PYTHON_MISSING || (process.platform === "win32" ? "the fake optiland's interpreter is a shell script" : false);

/** A configuration root whose `engines.optiland.python` runs the fake optiland. */
export interface FakeOptilandRoot {
  readonly rootDir: string;
  /** The copy of the fake's packages, which a test may edit: it lies outside every git checkout. */
  readonly site: string;
  /** The "interpreter": a script that runs the tests' Python with `site` in front of its path. */
  readonly python: string;
  /** The configuration of the root, loaded with nothing from the environment. */
  load(env?: Readonly<Record<string, string>>): LoadedConfig;
}

/**
 * Makes a temporary configuration root with a copy of the fake optiland and an interpreter for it, and writes its
 * `lvrtc.config.json` with `config` beside `engines.optiland.python`. The directory is removed after the test.
 */
export function fakeOptilandRoot(t: TestContext, config: Readonly<Record<string, unknown>> = {}): FakeOptilandRoot {
  const base = tempDir(t);
  const rootDir = join(base, "root");
  const site = join(base, "site");
  const python = join(base, "python-with-fake-optiland");
  mkdirSync(rootDir);
  cpSync(FAKE_OPTILAND_SITE, site, { recursive: true });
  const quoted = (text: string): string => `'${text.replaceAll("'", `'\\''`)}'`;
  // The worker's own PYTHONPATH (workers/python) comes after the fakes, so they shadow whatever is installed.
  writeFileSync(python, `#!/bin/sh\nPYTHONPATH=${quoted(site)}":$PYTHONPATH" exec ${quoted(PYTHON)} "$@"\n`);
  chmodSync(python, 0o755);
  const { engines = {}, ...other } = config as { engines?: Record<string, unknown> };
  const written = { ...other, engines: { ...engines, optiland: { python } } };
  writeFileSync(join(rootDir, CONFIG_FILE), JSON.stringify(written));
  return { rootDir, site, python, load: (env = {}) => loadConfig({ rootDir, env }) };
}
