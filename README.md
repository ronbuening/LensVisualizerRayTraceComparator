# LensVisualizer Ray-Trace Comparator

Cross-checks [LensVisualizer](https://github.com/ronbuening/LensVisualizer)'s ray trace and MTF against external
optical engines. It translates a LensVisualizer prescription into an engine-neutral case, runs each engine to the
same specification, and compares the results rung by rung: built system, paraxial data, identical rays, optical
path, then MTF.

The first external engine is [optiland](https://github.com/optiland/optiland). Engines sit behind one adapter
contract, so others can be added by a Python worker, a command line, file exchange or HTTP.

Status: Phase 0 (foundations) in progress. The full plan is in [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md).

## Requirements

- Node `>=24.15.0 <25`. Sources are TypeScript run by Node's native type stripping; there is no build step.
- Optional, for real comparisons: a LensVisualizer checkout and a Python interpreter with optiland installed.
  Neither is needed for `npm run check`.

## Commands

```bash
npm ci
```

```bash
npm run check
```

```bash
node bin/lvrtc.mjs --help
```

```bash
node bin/lvrtc.mjs doctor
```

```bash
node bin/lvrtc.mjs run test/fixtures/suites/fake-pair.json --root test/fixtures/fake-root
```

`npm run check` runs the type check, lint, format check and tests.

`lvrtc doctor [--json]` reports the Node version, every configuration value with the layer that set it, the
LensVisualizer checkout (path, commit, dirty flag), the Python interpreter and the optiland installation. A missing
LensVisualizer, Python or optiland is reported, not an error: doctor exits non-zero only for an unsupported Node
version or a configuration file it cannot use.

## Running a suite

`lvrtc run <suite.json> [--root <dir>] [--engines <id,...>] [--rungs <id,...>] [--json]` runs a suite: for every
run, every selected rung and every selected engine, it asks the rung's requests of the engine and records how each
job ended. The example above needs neither LensVisualizer nor optiland: its root defines three fake engines, and
its only rung, `selftest`, asks for the conformance quantity `selftest.echo`.

- **Engines** are every engine the configuration defines, unless the run lists its own `engines`; `--engines`
  replaces both. **Rungs** are every rung, unless the run lists its own `rungs`; `--rungs` replaces both. Phase 0
  has one rung, `selftest`.
- **`--root`** names the directory that holds `lvrtc.config.json`; the default is this repository. The suite file
  and `--root` are relative to the working directory. A fixture lens in a suite is relative to the root.
- **The result store** is `<runsDir>/store/`, one file per answer, keyed by the request, the engine's id and
  fingerprint and the engine options. A result of status `ok` or `unsupported` is stored the moment it arrives; an
  `error` never is. A run that finds an answer there does not ask the engine again, so a run that was killed
  resumes by being run again, and computes only what is missing.
- **The output** is `<runsDir>/<suite name>/`: `manifest.json` and `cases/<case id>.json`. The next run of the same
  suite replaces it. The manifest is canonical JSON and is the same, byte for byte, whether results were computed
  or found in the store, in any directory and on any machine: it holds no times and no absolute paths, and of what
  an engine or the system said only the codes. Which jobs were cached, and why a job failed, is printed and not
  stored. A run that could not be started is recorded with the reason, which names files relative to the root.
- **Exit code**: 0 when no job ended as an error and every run could be started (`unsupported` is an answer, not a
  failure); 1 otherwise; 2 when nothing was run because the suite file, an engine or a rung cannot be used as
  asked.

## Contract

Everything that crosses a boundary (an optical case, a run specification, a request to an engine, its result) is
a document of the engine-neutral contract in [contract/](contract/CONTRACT.md): JSON Schema files as the source of
truth, TypeScript types that mirror them, a small validator written here, and a corpus of valid and invalid
fixtures that every implementation must accept and reject identically. `contract/CONTRACT.md` fixes the frame,
units, signs, identity hashes and versioning.

## Configuration

Values are layered, lowest precedence first:

1. built-in defaults;
2. `lvrtc.config.json` (committed): sibling-relative defaults for the LensVisualizer and optiland checkouts;
3. `lvrtc.local.json` (gitignored): per-machine overrides; copy `lvrtc.local.example.json` to start;
4. the environment: `LVRTC_LV_PATH`, `LVRTC_PYTHON`, `LVRTC_OPTILAND_PYTHON`, `LVRTC_RUNS_DIR`.

| Key | Meaning |
|---|---|
| `lvPath` | LensVisualizer checkout, or `null` |
| `python` | Interpreter for the stdlib-only worker kit |
| `engines.optiland.python` | Interpreter that can import optiland, or `null` |
| `engines.<id>` | How the engine `<id>` is reached; see below |
| `cacheDir`, `runsDir` | Where caches and run results are written |

In the files, `engines.optiland.python` is written as nested objects, as in `lvrtc.local.example.json`. Relative
paths resolve against the configuration root, whichever layer they come from: the directory that holds
`lvrtc.config.json`, which is this repository unless `lvrtc run --root` names another. An interpreter given as a
bare command name (`python3`) is looked up on `PATH`. An unknown key or malformed JSON is an error naming the file.

An engine is defined under `engines.<id>` by the transport that reaches it:

```json
{
  "engines": {
    "fake-a": { "transport": "in-process", "module": "src/engines/fake/engine.ts", "options": { "id": "fake-a" } },
    "worker": { "transport": "stdio", "command": ["python3", "-m", "some_worker"], "env": { "MODE": "test" } }
  }
}
```

- `in-process`: `module` is a TypeScript module that exports `createEngine(options)`, which returns a function
  that answers protocol messages. `src/engines/fake/engine.ts` is one: an engine without optics, for tests.
- `stdio`: `command` is a worker's command line and `env` variables to set for it. The shape is accepted; the
  transport itself arrives with the Python worker kit.

`options` is handed to the engine as it is. A definition in `lvrtc.local.json` replaces the one `lvrtc.config.json`
gives the same id, whole. An engine that cannot be built or reached is found unavailable, with a code that says
why: `not-configured`, `load-failed`, `hello-failed`, `contract-mismatch` and so on.
