import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, resolve } from "node:path";
import { test, type TestContext } from "node:test";

import {
  CONFIG_FILE,
  CONFIG_KEYS,
  ENGINE_PLACEHOLDERS,
  LOCAL_CONFIG_FILE,
  REPO_ROOT,
  loadConfig,
} from "../../src/core/config.ts";

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
    engineDefinitions: {},
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
    engineDefinitions: {},
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

test("LVRTC_RUNS_DIR sets the runs directory above both files, and is resolved like every other path", (t) => {
  const rootDir = rootWith(t, {
    [CONFIG_FILE]: { runsDir: "from-config" },
    [LOCAL_CONFIG_FILE]: { runsDir: "from-local" },
  });
  const loaded = loadConfig({ rootDir, env: { LVRTC_RUNS_DIR: "from-env" } });
  assert.equal(loaded.config.runsDir, join(rootDir, "from-env"));
  assert.equal(loaded.sources.runsDir, "env");
  const elsewhere = resolve(rootDir, "..", "elsewhere");
  assert.equal(loadConfig({ rootDir, env: { LVRTC_RUNS_DIR: elsewhere } }).config.runsDir, elsewhere);
  const without = loadConfig({ rootDir, env: {} });
  assert.equal(without.config.runsDir, join(rootDir, "from-local"));
  assert.equal(without.sources.runsDir, LOCAL_CONFIG_FILE);
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
    [{ engines: { optiland: { pyhton: "python3" } } }, "engines.optiland.pyhton"],
    // `python` is a key of the optiland entry alone.
    [{ engines: { zemax: { python: "python3" } } }, "engines.zemax.python"],
    [{ engines: { zemax: { transport: "stdio", command: ["zemax"], timeout: 5 } } }, "engines.zemax.timeout"],
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
    [{ engines: { fake: { "options.id": "fake" } } }, "engines.fake.options.id"],
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
    engineDefinitions: {},
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

// ── Engine definitions ───────────────────────────────────────────────────────────────────────────────────────────

test("an in-process engine is a module path, resolved against the root, and options that default to none", (t) => {
  const rootDir = rootWith(t, {
    [CONFIG_FILE]: {
      engines: {
        "fake-b": { transport: "in-process", module: "engines/fake.ts", options: { id: "fake-b", bias: 0.5 } },
        "fake-a": { transport: "in-process", module: "../shared/engine.ts" },
        absolute: { transport: "in-process", module: "/opt/engines/engine.ts", options: {} },
      },
    },
  });
  const { config } = loadConfig({ rootDir, env: {} });
  assert.deepEqual(config.engineDefinitions, {
    absolute: { transport: "in-process", module: resolve("/opt/engines/engine.ts"), options: {} },
    "fake-a": { transport: "in-process", module: resolve(rootDir, "..", "shared", "engine.ts"), options: {} },
    "fake-b": {
      transport: "in-process",
      module: join(rootDir, "engines", "fake.ts"),
      options: { id: "fake-b", bias: 0.5 },
    },
  });
  // Sorted by id, whatever order the file wrote them in.
  assert.deepEqual(Object.keys(config.engineDefinitions), ["absolute", "fake-a", "fake-b"]);
  assert.deepEqual(config.engines, { optiland: { python: null } });
});

test("a stdio engine is a command line, whose first word resolves like an interpreter, and an environment", (t) => {
  const rootDir = rootWith(t, {
    [CONFIG_FILE]: {
      engines: {
        "by-name": { transport: "stdio", command: ["python3", "-m", "lvrtc_fake", "workers/x.py"] },
        "by-path": {
          transport: "stdio",
          command: ["./tools/worker", "--stdio"],
          options: { id: "by-path", nested: { list: [1, 2] } },
          env: { PYTHONPATH: "workers/python", EMPTY: "" },
        },
      },
    },
  });
  const { config } = loadConfig({ rootDir, env: {} });
  assert.deepEqual(config.engineDefinitions, {
    // A bare command name is left for PATH; the other words are passed as written, path or not.
    "by-name": { transport: "stdio", command: ["python3", "-m", "lvrtc_fake", "workers/x.py"], options: {}, env: {} },
    "by-path": {
      transport: "stdio",
      command: [join(rootDir, "tools", "worker"), "--stdio"],
      options: { id: "by-path", nested: { list: [1, 2] } },
      env: { PYTHONPATH: "workers/python", EMPTY: "" },
    },
  });
});

test("a stdio engine's command and env may use ${root} and ${python}, which are replaced; nothing else is", (t) => {
  const rootDir = rootWith(t, {
    [CONFIG_FILE]: {
      python: "tools/venv/bin/python",
      engines: {
        worker: {
          transport: "stdio",
          command: ["${python}", "-m", "worker", "--data=${root}/data", "${root}", "$HOME", "${", "$root", "{root}"],
          options: { note: "${root} is not replaced in options" },
          env: { PYTHONPATH: "${root}/workers/python:${root}/more", INTERPRETER: "${python}", PLAIN: "as written" },
        },
        "by-root": { transport: "stdio", command: ["${root}/bin/worker"] },
        "in-process": { transport: "in-process", module: "${root}.ts", options: { text: "${python}" } },
      },
    },
    // The placeholder is the value of the highest layer, whichever layer the definition is from.
    [LOCAL_CONFIG_FILE]: { python: "python3.13" },
  });
  const { config } = loadConfig({ rootDir, env: {} });
  assert.deepEqual(config.engineDefinitions.worker, {
    transport: "stdio",
    command: ["python3.13", "-m", "worker", `--data=${rootDir}/data`, rootDir, "$HOME", "${", "$root", "{root}"],
    options: { note: "${root} is not replaced in options" },
    env: { PYTHONPATH: `${rootDir}/workers/python:${rootDir}/more`, INTERPRETER: "python3.13", PLAIN: "as written" },
  });
  assert.deepEqual(config.engineDefinitions["by-root"], {
    transport: "stdio",
    command: [join(rootDir, "bin", "worker")],
    options: {},
    env: {},
  });
  // An in-process definition has no placeholders: its module is a path like any other.
  assert.deepEqual(config.engineDefinitions["in-process"], {
    transport: "in-process",
    module: join(rootDir, "${root}.ts"),
    options: { text: "${python}" },
  });

  // An interpreter given as a path is resolved before it is put in, and the environment is the highest layer.
  const fromEnv = loadConfig({ rootDir, env: { LVRTC_PYTHON: "venv/bin/python" } }).config.engineDefinitions.worker;
  assert.partialDeepStrictEqual(fromEnv, {
    command: [join(rootDir, "venv", "bin", "python"), "-m"],
    env: { INTERPRETER: join(rootDir, "venv", "bin", "python") },
  });
  assert.deepEqual([...ENGINE_PLACEHOLDERS], ["root", "python"]);
});

test("a ${...} that is not a placeholder is an error naming the member and the file", (t) => {
  const stdio = { transport: "stdio", command: ["python3"] };
  const cases: [unknown, string][] = [
    [{ ...stdio, command: ["python3", "${rootDir}/x"] }, '"engines.fake.command[1]" uses ${rootDir}'],
    [{ ...stdio, command: ["${Python}"] }, '"engines.fake.command[0]" uses ${Python}'],
    [{ ...stdio, env: { A: "${root}", PYTHONPATH: "${repo}/workers" } }, '"engines.fake.env.PYTHONPATH" uses ${repo}'],
    [{ ...stdio, env: { A: "${}" } }, '"engines.fake.env.A" uses ${}'],
    [{ ...stdio, env: { A: "${root }" } }, '"engines.fake.env.A" uses ${root }'],
  ];
  for (const [fake, problem] of cases) {
    const rootDir = rootWith(t, { [CONFIG_FILE]: { engines: { fake } } });
    assert.throws(
      () => loadConfig({ rootDir, env: {} }),
      {
        message:
          `${join(rootDir, CONFIG_FILE)}: ${problem}, ` + "which is not a placeholder: there are ${root} and ${python}",
      },
      problem,
    );
  }
});

test("engines.optiland.python stays a value of its own, with or without a definition beside it", (t) => {
  const alone = rootWith(t, { [CONFIG_FILE]: { engines: { optiland: { python: "../optiland/python" } } } });
  const loadedAlone = loadConfig({ rootDir: alone, env: {} });
  assert.equal(loadedAlone.config.engines.optiland.python, resolve(alone, "..", "optiland", "python"));
  assert.deepEqual(loadedAlone.config.engineDefinitions, {});

  // An entry that states nothing is allowed where the id has keys of its own.
  const empty = rootWith(t, { [CONFIG_FILE]: { engines: { optiland: {} } } });
  assert.deepEqual(loadConfig({ rootDir: empty, env: {} }).config.engineDefinitions, {});
  assert.equal(loadConfig({ rootDir: empty, env: {} }).config.engines.optiland.python, null);

  const both = rootWith(t, {
    [CONFIG_FILE]: {
      engines: {
        optiland: { python: "python3.13", transport: "stdio", command: ["python3.13", "-m", "lvrtc_optiland"] },
        fake: { transport: "in-process", module: "fake.ts" },
      },
    },
  });
  const loaded = loadConfig({ rootDir: both, env: { LVRTC_OPTILAND_PYTHON: "/env/python" } });
  assert.equal(loaded.config.engines.optiland.python, "/env/python");
  assert.equal(loaded.sources["engines.optiland.python"], "env");
  assert.deepEqual(loaded.config.engineDefinitions, {
    fake: { transport: "in-process", module: join(both, "fake.ts"), options: {} },
    optiland: { transport: "stdio", command: ["python3.13", "-m", "lvrtc_optiland"], options: {}, env: {} },
  });
});

test("a higher layer replaces an engine definition whole and adds engines of its own", (t) => {
  const rootDir = rootWith(t, {
    [CONFIG_FILE]: {
      engines: {
        kept: { transport: "in-process", module: "kept.ts", options: { id: "kept" } },
        replaced: { transport: "stdio", command: ["worker"], options: { id: "replaced" }, env: { A: "1" } },
      },
    },
    [LOCAL_CONFIG_FILE]: {
      engines: {
        replaced: { transport: "in-process", module: "local/replaced.ts" },
        added: { transport: "stdio", command: ["other"] },
      },
    },
  });
  assert.deepEqual(loadConfig({ rootDir, env: {} }).config.engineDefinitions, {
    added: { transport: "stdio", command: ["other"], options: {}, env: {} },
    kept: { transport: "in-process", module: join(rootDir, "kept.ts"), options: { id: "kept" } },
    // Nothing of the lower layer's definition is left: not its options, not its environment.
    replaced: { transport: "in-process", module: join(rootDir, "local", "replaced.ts"), options: {} },
  });
});

test("an engine id that an object inherits a member for is an engine id like any other", (t) => {
  const rootDir = rootWith(t, {
    [CONFIG_FILE]: { engines: { constructor: { transport: "in-process", module: "a.ts" } } },
  });
  assert.deepEqual(Object.entries(loadConfig({ rootDir, env: {} }).config.engineDefinitions), [
    ["constructor", { transport: "in-process", module: join(rootDir, "a.ts"), options: {} }],
  ]);
});

test("an engine definition of the wrong shape is an error naming the key and the file", (t) => {
  const inProcess = { transport: "in-process", module: "fake.ts" };
  const stdio = { transport: "stdio", command: ["python3"] };
  const idRule = 'is not an engine id: a lowercase letter, then lowercase letters, digits or "-"';
  const transports = '"in-process" or "stdio"';
  const cases: [unknown, string][] = [
    [{ Fake: inProcess }, `"engines.Fake" ${idRule}`],
    [{ fake_engine: inProcess }, `"engines.fake_engine" ${idRule}`],
    [{ "2fake": inProcess }, `"engines.2fake" ${idRule}`],
    [{ "": inProcess }, `"engines." ${idRule}`],
    [{ fake: "fake.ts" }, '"engines.fake" must be an object'],
    [{ fake: [inProcess] }, '"engines.fake" must be an object'],
    // An entry that defines nothing, under an id without keys of its own.
    [{ fake: {} }, `"engines.fake.transport" must be ${transports}`],
    [{ fake: { module: "fake.ts" } }, `"engines.fake.transport" must be ${transports}`],
    [{ fake: { ...inProcess, transport: "http" } }, `"engines.fake.transport" must be ${transports}`],
    [{ fake: { ...inProcess, transport: null } }, `"engines.fake.transport" must be ${transports}`],
    [{ optiland: { python: "python3", command: ["python3"] } }, `"engines.optiland.transport" must be ${transports}`],
    [{ fake: { transport: "in-process" } }, '"engines.fake.module" must be a non-empty string'],
    [{ fake: { ...inProcess, module: "" } }, '"engines.fake.module" must be a non-empty string'],
    [{ fake: { ...inProcess, module: ["fake.ts"] } }, '"engines.fake.module" must be a non-empty string'],
    [{ fake: { ...inProcess, options: null } }, '"engines.fake.options" must be an object'],
    [{ fake: { ...inProcess, options: ["bias"] } }, '"engines.fake.options" must be an object'],
    [{ fake: { ...stdio, options: "id=fake" } }, '"engines.fake.options" must be an object'],
    [{ fake: { transport: "stdio" } }, '"engines.fake.command" must be a non-empty list of non-empty strings'],
    [{ fake: { ...stdio, command: [] } }, '"engines.fake.command" must be a non-empty list of non-empty strings'],
    [
      { fake: { ...stdio, command: "python3 -m x" } },
      '"engines.fake.command" must be a non-empty list of non-empty strings',
    ],
    [
      { fake: { ...stdio, command: ["python3", 3] } },
      '"engines.fake.command" must be a non-empty list of non-empty strings',
    ],
    [
      { fake: { ...stdio, command: ["python3", ""] } },
      '"engines.fake.command" must be a non-empty list of non-empty strings',
    ],
    [{ fake: { ...stdio, env: ["A=1"] } }, '"engines.fake.env" must be an object'],
    [{ fake: { ...stdio, env: null } }, '"engines.fake.env" must be an object'],
    [{ fake: { ...stdio, env: { A: "1", JOBS: 4 } } }, '"engines.fake.env.JOBS" must be a string'],
    [{ fake: { ...stdio, env: { A: null } } }, '"engines.fake.env.A" must be a string'],
  ];
  for (const [engines, problem] of cases) {
    const rootDir = rootWith(t, { [LOCAL_CONFIG_FILE]: { engines } });
    assert.throws(
      () => loadConfig({ rootDir, env: {} }),
      { message: `${join(rootDir, LOCAL_CONFIG_FILE)}: ${problem}` },
      problem,
    );
  }
});

test("a member of the other transport is an unknown key, and the error says what the transport has", (t) => {
  const cases: [unknown, string][] = [
    [
      { transport: "in-process", module: "fake.ts", command: ["python3"] },
      'unknown key "engines.fake.command" (a definition with transport "in-process" has transport, module, options)',
    ],
    [
      { transport: "in-process", module: "fake.ts", env: {} },
      'unknown key "engines.fake.env" (a definition with transport "in-process" has transport, module, options)',
    ],
    [
      { transport: "stdio", command: ["python3"], module: "fake.ts" },
      'unknown key "engines.fake.module" (a definition with transport "stdio" has transport, command, options, env)',
    ],
  ];
  for (const [fake, problem] of cases) {
    const rootDir = rootWith(t, { [CONFIG_FILE]: { engines: { fake } } });
    assert.throws(
      () => loadConfig({ rootDir, env: {} }),
      { message: `${join(rootDir, CONFIG_FILE)}: ${problem}` },
      problem,
    );
  }
});
