# LensVisualizer Ray-Trace Comparator

Cross-checks [LensVisualizer](https://github.com/ronbuening/LensVisualizer)'s ray trace and MTF against external
optical engines. It translates a LensVisualizer prescription into an engine-neutral case, runs each engine to the
same specification, and compares the results rung by rung: built system, paraxial data, identical rays, optical
path, then MTF.

The first external engine is [optiland](https://github.com/optiland/optiland). Engines sit behind one adapter
contract, so others can be added by a Python worker, a command line, file exchange or HTTP.

Status: Phase 0 (foundations) is complete: the whole pipeline runs, on fake engines that know no optics. Phase 1
(LensVisualizer as case source and engine) has begun with the binding that loads LensVisualizer. The full plan is
in [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md).

## Try it

Three commands take a suite from engines to a report. The fixture suite below needs neither LensVisualizer nor
optiland: its three engines are a TypeScript fake (the reference), the Python fake with a bias that stays inside
the tolerance, and a fake that offers no quantity.

```bash
node bin/lvrtc.mjs run test/fixtures/suites/fake-3-engines.json --root test/fixtures/fake-root
```

```bash
node bin/lvrtc.mjs compare fake-3-engines --root test/fixtures/fake-root
```

```bash
node bin/lvrtc.mjs report fake-3-engines --root test/fixtures/fake-root
```

The report is `test/fixtures/fake-root/runs/fake-3-engines/report.md` (the fixture root's `runsDir`, which git
ignores; set `LVRTC_RUNS_DIR` to write elsewhere). Run the three again and it is the same file, byte for byte.
Without Python, use `fake-3-engines-ts`, the same trio with a TypeScript engine in the Python one's place.

## Requirements

- Node `>=24.15.0 <25`. Sources are TypeScript run by Node's native type stripping; there is no build step.
- Python `>=3.10` as `python3`, for the worker kit and its tests. Nothing is installed into it: the kit uses the
  standard library only.
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

```bash
node bin/lvrtc.mjs engine conformance fake-py --root test/fixtures/fake-root
```

```bash
npm run test:python
```

```bash
npm run test:lv
```

```bash
node bin/lvrtc.mjs lenses list
```

```bash
node bin/lvrtc.mjs lenses show nikkor-z50f12
```

`npm run check` runs the type check, lint, format check, the TypeScript tests and the Python tests of the worker
kit. A TypeScript test that needs Python is skipped, with the reason, where `python3` (or `LVRTC_PYTHON`) is
missing or older than 3.10; `npm run test:python` itself needs it.

`npm run test:lv` runs the tests in `test/integration/lv`, which need the real LensVisualizer checkout. They are
not part of `npm run check`, which passes with no LensVisualizer on disk; each skips, with the reason, when
LensVisualizer is not configured or not there. They write nothing, and the LensVisualizer numbers they pin name
the commit they were taken at.

`lvrtc doctor [--json]` reports the Node version, every configuration value with the layer that set it, the
LensVisualizer checkout (path, commit, dirty flag, and the file count and closure hash of the engine code the
binding loads), the Python interpreter and the optiland installation. A missing LensVisualizer, one that is there
and cannot be loaded, and a missing Python or optiland are reported, not errors: doctor exits non-zero only for an
unsupported Node version or a configuration file it cannot use.

## LensVisualizer

LensVisualizer is read, never written, and only through `src/engines/lv/binding.ts`. `loadLvBinding(lvPath)`
installs the loader that runs LensVisualizer's TypeScript headless, imports the modules of an import manifest
(`src/engines/lv/manifest.ts`) and checks every export before anything is traced: a function LensVisualizer has
renamed is reported at load time, with every missing name in one error. The comparator's own types for what it
reads are local (`src/engines/lv/types.ts`), so the type check needs no LensVisualizer.

- **The engine fingerprint** is `{ engineClosureHash, engineFileCount, commit, dirty }`. The closure hash covers
  the engine source files Node actually loaded. Lens prescription files (`src/lens-data/**/*.data.ts` and
  `*.teleconverter.ts`) are not engine code: each is hashed by itself, so editing a lens never changes the engine
  fingerprint. `commit` and `dirty` come from git, restricted to the LensVisualizer directory: when it sits inside
  another repository, the commit is the last one that touched it, not that repository's `HEAD`; both are null
  outside git. `rehash()` reads the loaded engine files again and names those that changed since they were loaded.
- **The catalog** is an index of every `*.data.ts` under `src/lens-data`, by lens key, with the file and its
  hash. LensVisualizer has no such index outside its bundler, so the files are imported, once per process.
  Duplicate keys and files without a default export or a string key are reported together.

`lvrtc lenses list [--root <dir>] [--json]` prints the number of lenses and the key, name and file of each.
`lvrtc lenses show <key> [--zoom <t>] [--focus <t>] [--root <dir>] [--json]` prints the lens as LensVisualizer
prepares it for tracing at one zoom and focus position (0 to 1, default 0): a row per surface with its radius or
`flat`, the gap and index after it, the clear semi-diameter and the vertex position, then the stop surface and
its runtime radius, the last lens surface, the image plane and the surface count. Rear plates are surfaces of the
prepared state and are marked `rearPlate`. A key that is not in the catalog is a usage error that suggests the
nearest keys. Both commands print to the console only.

## Running a suite

`lvrtc run <suite.json> [--root <dir>] [--engines <id,...>] [--rungs <id,...>] [--json]` runs a suite: for every
run, every selected rung and every selected engine, it asks the rung's requests of the engine and records how each
job ended. The example above needs neither LensVisualizer nor optiland: its root defines six fake engines, four
in this process and two, `fake-py` and `fake-pyn`, Python workers, and its only rung, `selftest`, asks for the
conformance quantity `selftest.echo`. Without Python, add `--engines fake-a,fake-b,fake-none`.

- **Engines** are every engine the configuration defines, unless the run lists its own `engines`; `--engines`
  replaces both. **Rungs** are every rung, unless the run lists its own `rungs`; `--rungs` replaces both. Phase 0
  has one rung, `selftest`.
- **`--root`** names the directory that holds `lvrtc.config.json`; the default is this repository. The suite file
  and `--root` are relative to the working directory. A fixture lens in a suite is relative to the root. In every
  command an option's value may follow it as the next word or after an equals sign: `--root <dir>` or
  `--root=<dir>`.
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

## Comparing and reporting

`lvrtc compare <suite name | run directory> [--root <dir>] [--reference <engine>] [--mode reference-vs-each|pairwise|both] [--json]`
compares what the engines of a run answered. It asks no engine anything: it reads the run's manifest and the
answers in the result store, and writes `comparisons.json` into the run directory.

- **A run** is named by its suite, which is looked up in the `runsDir` of the root, or by its run directory.
- **Groups.** The answers of every engine to one request are one group, compared twice: every engine against a
  reference (N − 1 pairs), and every engine against every other (N(N − 1)/2 pairs). Two engines are a group of two.
- **The reference** is `--reference`, else the run's `referenceEngine`, else the first engine, by id, that has an
  `ok` result.
- **The policy**, `policy/rungs.v1.json`, says for each rung which quantity it compares, in which mode (`direct`,
  `identical-rays` or `independent-method`), whether it is `gated` or `recorded`, and the tolerance or attention
  band of each metric. A gated metric has a tolerance, and an independent-method rung is never gated.
- **Verdicts.** `UNSUPPORTED` when either engine cannot answer; `ERROR` when either gave no result or the two
  cannot be compared; on a gated rung `PASS` or `FAIL`, where a metric that is not a number fails; on a recorded
  rung `RECORDED`, or `ATTENTION` outside the band. Only `FAIL` and `ERROR` are failures.
- **Exit code**: 0 when no pair is `FAIL` or `ERROR`; 1 otherwise; 2 when nothing was compared because the run has
  no manifest or the reference is not an engine of the run.

`lvrtc report <suite name | run directory> [--root <dir>]` writes `report.json` and `report.md` into the run
directory from the manifest, the comparisons and the policy: the inputs (suite, contract version, policy version,
engines with fingerprints), the verdict counts, a support matrix of rung by engine, and for each run and rung a
reference-vs-each table and a pairwise matrix, with a note on how to read the verdicts. It exits 0 when the report
is written, whatever the verdicts are, and 2 when the run has no comparisons or they were made from another
manifest or policy. Both files, like `comparisons.json`, hold no time, no path and nothing of the machine, so the
same run gives the same bytes anywhere.

The expected reports of the fixture suites are in `test/fixtures/golden`; `node test/report/writeGolden.ts`
rewrites them after a change that is meant to change a report.

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
- `stdio`: `command` is a worker's command line and `env` variables to set for it. The worker is a process that
  speaks the protocol as NDJSON on its standard streams; see below.

`options` is handed to the engine as it is. A definition in `lvrtc.local.json` replaces the one `lvrtc.config.json`
gives the same id, whole. An engine that cannot be built or reached is found unavailable, with a code that says
why: `not-configured`, `load-failed`, `spawn-failed`, `hello-failed`, `contract-mismatch` and so on.

## Workers over stdio

A `stdio` engine is a worker process. The comparator writes one protocol message per line to its standard input
and reads one reply per line from its standard output; the worker's standard error is its log, read all the time
and kept as a tail that is quoted when the worker fails.

```json
{
  "engines": {
    "fake-py": {
      "transport": "stdio",
      "command": ["${python}", "-m", "lvrtc_worker_kit.fake_engine"],
      "options": { "id": "fake-py" },
      "env": { "PYTHONPATH": "${root}/workers/python" }
    }
  }
}
```

- **The command** is started once, without a shell, with the configuration root as its working directory. Its
  first word is a bare command name, looked up on `PATH`, or a path resolved against the root; the other words are
  passed as written.
- **Placeholders.** In `command` and in the values of `env`, `${root}` is the configuration root and `${python}`
  the configuration value `python`. Nothing else is replaced, and any other `${...}` is an error naming the file.
- **The environment** is built, not inherited: `PATH`, `HOME` and the few other variables a program needs to
  start; `PYTHONDONTWRITEBYTECODE=1` and `PYTHONUNBUFFERED=1`; `LVRTC_ENGINE_OPTIONS`, the definition's `options`
  as JSON; then the definition's `env`, which may replace any of them. Nothing is guessed: a Python worker gets
  its `PYTHONPATH` from `env`, as above.
- **One message at a time** per worker. A worker that does not reply in time is killed and the call reported as a
  timeout; one that exits, writes a line that is not JSON, writes a line that is too long, or answers another
  message than the one asked is reported with a code that says which (`exited`, `not-json`, `oversized-line`,
  `unexpected-reply`). A worker that has gone stays gone for the rest of the run.
- **Closing** sends `shutdown`, closes the worker's input, waits two seconds and then kills it. Only the worker
  is waited for: a process the worker started may keep the worker's output open after it, and the comparator stops
  reading a second after the worker has ended.

`lvrtc engine conformance <id> [--root <dir>] [--json]` checks a configured engine against the contract, over
whatever transport reaches it: `hello` gives a valid descriptor of this contract and of the configured id; an
unknown quantity is answered `unsupported`, not with an error; a malformed `run` is refused with `ok: false`; ids
are echoed; if the engine offers `selftest.echo`, the contract's examples are answered byte for byte (a NaN with a
payload, −0, the infinities, subnormals, the largest double, an empty array, a 2-D array, scaling and summing); a
repeated request gets an equal result if the descriptor says the engine is deterministic; and `shutdown` is
answered with an empty object, after which a worker process ends by itself with exit code 0. Each check is printed
`PASS`, `FAIL` or `SKIPPED` with a reason. The exit code is 0 when nothing failed, 1 when a check did, and 2 for an
id the configuration does not define.

## The Python worker kit

`workers/python/lvrtc_worker_kit` is what a Python worker needs to speak the protocol. It imports nothing outside
the standard library, writes nothing to disk and runs on Python 3.10 and later.

| Module | Is |
|---|---|
| `ndarray` | the NdArray wire form: bit-exact, independent of the host's byte order |
| `validate` | the contract's schema validator, a port of `src/contract/validate.ts` that reads `contract/schema/v1` |
| `protocol` | the NDJSON loop around an engine object with `describe()` and `run(request, case)` |
| `fake_engine` | the fake engine as a worker: `python -m lvrtc_worker_kit.fake_engine [--id ID] [--bias X] [--no-quantities] [--fingerprint F]` |

The loop answers every line with exactly one line and never crashes on one: a line that is not JSON, an unknown
method, a request that is not valid by the contract and an exception in the engine are all answered
`{ "ok": false, "error": { "code", "message" } }`. Standard output carries replies only. A worker echoes the ids
it is given and never recomputes them.

The Python fake engine and the TypeScript one are interchangeable: for one request they give byte-identical
results. The kit's tests are `unittest`, in `workers/python/tests/kit`, and run the validator against the same
fixture corpus as the TypeScript tests:

```bash
python3 -m unittest discover -s workers/python/tests/kit -t workers/python
```
