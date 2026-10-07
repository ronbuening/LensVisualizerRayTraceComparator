import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, resolve } from "node:path";
import { test, type TestContext } from "node:test";

import { CONFIG_FILE, CONFIG_KEYS, LOCAL_CONFIG_FILE, REPO_ROOT, loadConfig } from "../../src/core/config.ts";

/** A temporary root directory holding the given files; a string is written verbatim, anything else as JSON. */
function rootWith(t: TestContext, files: Record<string, unknown> = {}): string {
  const dir = realpathSync(mkdtempSync(join(tmpdir(), "lvrtc-config-")));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  for (const [name, content] of Object.entries(files)) {
    writeFileSync(join(dir, name), typeof content === "string" ? content : JSON.stringify(content));
  }
  return dir;
}

test("with no files and no environment the built-in defaults apply", (t) => {
  const rootDir = rootWith(t);
  const loaded = loadConfig({ rootDir, env: {} });
  assert.equal(loaded.rootDir, rootDir);
  assert.deepEqual(loaded.config, {
    lvPath: null,
    python: "python3",
    engines: { optiland: { python: null } },
    cacheDir: join(rootDir, ".cache"),
    runsDir: join(rootDir, "runs"),
  });
  assert.deepEqual(Object.keys(loaded.sources).sort(), [...CONFIG_KEYS].sort());
  for (const key of CONFIG_KEYS) assert.equal(loaded.sources[key], "default", key);
});

test("each layer overrides the previous one and every value remembers its layer", (t) => {
  const rootDir = rootWith(t, {
    [CONFIG_FILE]: {
      lvPath: "/lv/from-config",
      python: "python-config",
      engines: { optiland: { python: "/optiland/from-config/python" } },
      cacheDir: "/cache/from-config",
    },
    [LOCAL_CONFIG_FILE]: {
      lvPath: "/lv/from-local",
      python: "python-local",
      engines: { optiland: { python: "/optiland/from-local/python" } },
    },
  });
  const loaded = loadConfig({ rootDir, env: { LVRTC_LV_PATH: "/lv/from-env", LVRTC_PYTHON: "python-env" } });
  assert.deepEqual(loaded.config, {
    lvPath: "/lv/from-env",
    python: "python-env",
    engines: { optiland: { python: "/optiland/from-local/python" } },
    cacheDir: "/cache/from-config",
    runsDir: join(rootDir, "runs"),
  });
  assert.deepEqual(loaded.sources, {
    lvPath: "env",
    python: "env",
    "engines.optiland.python": LOCAL_CONFIG_FILE,
    cacheDir: CONFIG_FILE,
    runsDir: "default",
  });
});

test("the environment overrides every file layer", (t) => {
  const rootDir = rootWith(t, {
    [CONFIG_FILE]: { engines: { optiland: { python: "/optiland/from-config/python" } } },
    [LOCAL_CONFIG_FILE]: { engines: { optiland: { python: "/optiland/from-local/python" } } },
  });
  const loaded = loadConfig({ rootDir, env: { LVRTC_OPTILAND_PYTHON: "/optiland/from-env/python" } });
  assert.equal(loaded.config.engines.optiland.python, "/optiland/from-env/python");
  assert.equal(loaded.sources["engines.optiland.python"], "env");
});

test("an empty environment variable sets nothing", (t) => {
  const rootDir = rootWith(t, { [CONFIG_FILE]: { lvPath: "/lv/from-config" } });
  const loaded = loadConfig({ rootDir, env: { LVRTC_LV_PATH: "", LVRTC_PYTHON: undefined } });
  assert.equal(loaded.config.lvPath, "/lv/from-config");
  assert.equal(loaded.sources.lvPath, CONFIG_FILE);
  assert.equal(loaded.sources.python, "default");
});

test("relative paths resolve against the root directory, from every layer", (t) => {
  const rootDir = rootWith(t, {
    [CONFIG_FILE]: { lvPath: "../lv", cacheDir: "tmp/cache", runsDir: "./out/runs" },
    [LOCAL_CONFIG_FILE]: { engines: { optiland: { python: "../optiland/.venv/bin/python" } } },
  });
  const loaded = loadConfig({ rootDir, env: { LVRTC_PYTHON: "tools/python" } });
  assert.equal(loaded.config.lvPath, resolve(rootDir, "..", "lv"));
  assert.equal(loaded.config.cacheDir, join(rootDir, "tmp", "cache"));
  assert.equal(loaded.config.runsDir, join(rootDir, "out", "runs"));
  assert.equal(loaded.config.engines.optiland.python, resolve(rootDir, "..", "optiland", ".venv", "bin", "python"));
  assert.equal(loaded.config.python, join(rootDir, "tools", "python"));
});

test("an interpreter given as a bare command name is not turned into a path", (t) => {
  const rootDir = rootWith(t, { [CONFIG_FILE]: { python: "python3.13" } });
  const loaded = loadConfig({ rootDir, env: { LVRTC_OPTILAND_PYTHON: "python3" } });
  assert.equal(loaded.config.python, "python3.13");
  assert.equal(loaded.config.engines.optiland.python, "python3");
});

test("a relative root directory is made absolute", (t) => {
  const rootDir = rootWith(t, { [CONFIG_FILE]: { runsDir: "out" } });
  const loaded = loadConfig({ rootDir: relative(process.cwd(), rootDir), env: {} });
  assert.equal(loaded.rootDir, rootDir);
  assert.equal(loaded.config.runsDir, join(rootDir, "out"));
});

test("a higher layer can set a nullable value back to null", (t) => {
  const rootDir = rootWith(t, {
    [CONFIG_FILE]: { lvPath: "/lv/from-config", engines: { optiland: { python: "python3" } } },
    [LOCAL_CONFIG_FILE]: { lvPath: null, engines: { optiland: { python: null } } },
  });
  const loaded = loadConfig({ rootDir, env: {} });
  assert.equal(loaded.config.lvPath, null);
  assert.equal(loaded.config.engines.optiland.python, null);
  assert.equal(loaded.sources.lvPath, LOCAL_CONFIG_FILE);
  assert.equal(loaded.sources["engines.optiland.python"], LOCAL_CONFIG_FILE);
});

test("an unknown key is an error naming the key and the file", (t) => {
  const cases: [unknown, string][] = [
    [{ lvPaht: "/lv" }, "lvPaht"],
    [{ engines: { zemax: {} } }, "engines.zemax"],
    [{ engines: { optiland: { pyhton: "python3" } } }, "engines.optiland.pyhton"],
  ];
  for (const [content, key] of cases) {
    const rootDir = rootWith(t, { [LOCAL_CONFIG_FILE]: content });
    assert.throws(
      () => loadConfig({ rootDir, env: {} }),
      { message: `${join(rootDir, LOCAL_CONFIG_FILE)}: unknown key "${key}"` },
      key,
    );
  }
});

test("a key written with dots is unknown, and the error says to nest it", (t) => {
  const cases: [unknown, string][] = [
    [{ "engines.optiland.python": "python3" }, "engines.optiland.python"],
    [{ engines: { "optiland.python": "python3" } }, "engines.optiland.python"],
    [{ "engines.optiland": { python: "python3" } }, "engines.optiland"],
  ];
  for (const [content, key] of cases) {
    const rootDir = rootWith(t, { [CONFIG_FILE]: content });
    assert.throws(
      () => loadConfig({ rootDir, env: {} }),
      { message: `${join(rootDir, CONFIG_FILE)}: unknown key "${key}" (nest objects instead of writing dots)` },
      key,
    );
  }
});

test("a value of the wrong type is an error naming the key and the file", (t) => {
  const cases: [unknown, string][] = [
    [{ python: null }, `"python" must be a non-empty string`],
    [{ python: "" }, `"python" must be a non-empty string`],
    [{ cacheDir: 3 }, `"cacheDir" must be a non-empty string`],
    [{ lvPath: ["/lv"] }, `"lvPath" must be a non-empty string or null`],
    [{ engines: "optiland" }, `"engines" must be an object`],
    [{ engines: { optiland: null } }, `"engines.optiland" must be an object`],
    [["lvPath"], "the top level must be an object"],
  ];
  for (const [content, problem] of cases) {
    const rootDir = rootWith(t, { [CONFIG_FILE]: content });
    assert.throws(
      () => loadConfig({ rootDir, env: {} }),
      { message: `${join(rootDir, CONFIG_FILE)}: ${problem}` },
      problem,
    );
  }
});

test("malformed JSON is an error naming the file", (t) => {
  const rootDir = rootWith(t, { [CONFIG_FILE]: { python: "python3" }, [LOCAL_CONFIG_FILE]: '{ "lvPath": ' });
  assert.throws(
    () => loadConfig({ rootDir, env: {} }),
    (error: Error) => error.message.startsWith(`${join(rootDir, LOCAL_CONFIG_FILE)}: malformed JSON (`),
  );
});

test("a file that exists but cannot be read is an error naming the file", (t) => {
  const rootDir = rootWith(t);
  mkdirSync(join(rootDir, LOCAL_CONFIG_FILE));
  assert.throws(
    () => loadConfig({ rootDir, env: {} }),
    (error: Error) => error.message.startsWith(`${join(rootDir, LOCAL_CONFIG_FILE)}: cannot be read (`),
  );
});

// The committed files are loaded from a copy, so a developer's own lvrtc.local.json never reaches these tests.
test("the committed lvrtc.config.json points at the sibling checkouts", (t) => {
  const rootDir = rootWith(t, { [CONFIG_FILE]: readFileSync(join(REPO_ROOT, CONFIG_FILE), "utf8") });
  const loaded = loadConfig({ rootDir, env: {} });
  assert.deepEqual(loaded.config, {
    lvPath: resolve(rootDir, "../../LensVisualizer/LensVisualizer"),
    python: "python3",
    engines: { optiland: { python: resolve(rootDir, "../../optiland/optiland/.venv/bin/python") } },
    cacheDir: join(rootDir, ".cache"),
    runsDir: join(rootDir, "runs"),
  });
  for (const key of CONFIG_KEYS) assert.equal(loaded.sources[key], CONFIG_FILE, key);
});

test("the example local file is a valid local configuration", (t) => {
  const example = readFileSync(join(REPO_ROOT, "lvrtc.local.example.json"), "utf8");
  const rootDir = rootWith(t, { [LOCAL_CONFIG_FILE]: example });
  const loaded = loadConfig({ rootDir, env: {} });
  assert.equal(loaded.sources.lvPath, LOCAL_CONFIG_FILE);
  assert.equal(loaded.sources["engines.optiland.python"], LOCAL_CONFIG_FILE);
});
