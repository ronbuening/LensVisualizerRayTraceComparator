# LensVisualizer Ray-Trace Comparator

Cross-checks [LensVisualizer](https://github.com/ronbuening/LensVisualizer)'s ray trace and MTF against external
optical engines. It translates a LensVisualizer prescription into an engine-neutral case, runs each engine to the
same specification, and compares the results rung by rung: built system, paraxial data, identical rays, optical
path, then MTF.

The first external engine is [optiland](https://github.com/optiland/optiland). Engines sit behind one adapter
contract, so others can be added by a Python worker, a command line, file exchange or HTTP.

Status: Phase 0 (foundations) is complete: the whole pipeline runs, on fake engines that know no optics. Phase 1
(LensVisualizer as case source and engine) has the binding that loads LensVisualizer, the exporter that writes
its lenses as engine-neutral cases, the suites of lenses to compare, the comparator's own reference engine `ref`
and LensVisualizer itself as the engine `lv`. Both answer the first two rungs of the ladder, the built-system echo
and the first-order data, and agree on them for every lens of the two suites. Rays cross the contract too: a run
has ray sets, which are LensVisualizer's own launch rays for a LensVisualizer lens, and `lv` traces them with
LensVisualizer's tracer. The reference engine's tracer, and the rungs that compare traced rays, come next. The full
plan is in [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md); what an engine does that a comparison has
to know about is in [docs/gotchas.md](docs/gotchas.md).

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

```bash
node bin/lvrtc.mjs export nikkor-z50f12 --aperture f/2.8 --lines photopic --out /tmp/z50.case.json
```

```bash
node bin/lvrtc.mjs export --all
```

```bash
node bin/lvrtc.mjs run suites/smoke.json --engines ref --rungs r0,r1
```

```bash
node bin/lvrtc.mjs engine conformance ref
```

```bash
node bin/lvrtc.mjs run suites/benchmark.json --engines lv,ref --rungs r0,r1
```

```bash
node bin/lvrtc.mjs compare benchmark
```

```bash
node bin/lvrtc.mjs engine conformance lv
```

```bash
node bin/lvrtc.mjs run suites/benchmark.json --engines lv --rungs rays
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

### Cases

`lvrtc export <lensKey> [--zoom <t>] [--focus <t>] [--aperture wide-open|f/<N>|r=<mm>] [--lines reference|cdf|photopic] [--out <file>] [--root <dir>]`
writes one lens as an **optical case**, the document every engine is asked about, as canonical JSON: to `--out`,
or else to the output. The case is built from the state LensVisualizer prepares for tracing and from the functions
its own tracers call (the clip radius of every surface, the lines and their weights, the index after every surface
at every line, the object of a certified focus station), never from authored surface fields. The mapping, member
by member, is in [contract/CONTRACT.md](contract/CONTRACT.md#cases-from-lensvisualizer).

- **The stop.** `wide-open` is LensVisualizer's wide-open stop radius at that zoom position; `f/<N>` is its linear
  stop-down rule, `wide-open radius × widest f-number / N`; `r=<mm>` is a stop radius as given. An f-number faster
  than wide open is refused, not clamped.
- **Focus.** Infinity, or a focus position LensVisualizer certifies an object distance for. Any other focus
  position is refused: a refocused lens is never exported with its object at infinity.
- **What a case cannot express is reported with a code**, never approximated: a folded path, a mirror or a
  blocker, a diffractive surface, a tilted image plane, and what LensVisualizer itself has no data for (lines for a
  lens without dispersion data, mixed d and e references). A lens that cannot be exported as asked exits 1 with
  every reason, as `<key>: <code>: <message>`.

`lvrtc export --all [--census <dir>] [--json] [--root <dir>]` exports every lens at its default state (zoom 0,
infinity focus, wide open, the design image plane) on its reference line, never stopping at a lens, and prints
how many were exported and how many were not, by reason. `--census <dir>` writes the **census** to
`lv-export.json` and `lv-export.md` in that directory: the counts, the lens keys under each reason, the feature
flags and limits of the exported cases, and the LensVisualizer commit and engine closure hash it was taken of. The
committed one is in [reports/census/](reports/census/lv-export.md); it is a snapshot, holds no surface data and
is asserted nowhere. Rewrite it with `node bin/lvrtc.mjs export --all --census reports/census`.

### Suites

Three suites of LensVisualizer lenses are in `suites/`. None names a rung: a run uses every rung that is judged.
Each names the built-in engines, `lv` and `ref`, as the engines of its runs, so that it runs at the root of this
repository, whose configuration defines no engine; `--engines` names others.

| Suite | Is |
|---|---|
| `smoke.json` | two small lenses, one of them also on the photopic lines |
| `benchmark.json` | the 12 benchmark configurations (11 lenses, `nikon-z-24-70f4s` at both ends of its zoom), each on its reference line and on the photopic lines |
| `features.json` | one lens for each translation path the benchmark lacks, named after the path: an odd-order asphere, an e-line lens, a term of power 20, an asphere on a flat base, an authored rear-plate rim, a fixed-iris zoom at its tele end, an asphere without a term, a stop inside an element |

Two translation paths have no run, because no lens of the catalog has a case for them: the one lens that mixes d
and e references has no wavelength data for every glass (`mixed-reference`), and every lens with an annular
aperture is a mirror lens (`folded-path`). A run that can never have a case would only make the suite fail. An
integration test exports those lenses and fails on the day one of them has a case
([docs/gotchas.md](docs/gotchas.md)).

## Running a suite

`lvrtc run <suite.json> [--root <dir>] [--engines <id,...>] [--rungs <id,...>] [--json]` runs a suite: for every
run, every selected rung and every selected engine, it asks the rung's requests of the engine and records how each
job ended. The example above needs neither LensVisualizer nor optiland: its root defines six fake engines, four
in this process and two, `fake-py` and `fake-pyn`, Python workers, and its suite names one rung, `selftest`, which
asks for the conformance quantity `selftest.echo`. Without Python, add `--engines fake-a,fake-b,fake-none`.

- **Lenses.** A run names an optical-case file (`{ "kind": "fixture", "path" }`) or a LensVisualizer lens
  (`{ "kind": "lv", "key" }`), whose case is exported from the configured checkout (`lvPath`) in the state, at the
  aperture, on the lines and at the image plane the run states, exactly as `lvrtc export` does. A lens that cannot
  be exported as asked is a run that is not started, with the exporter's coded reasons. LensVisualizer is loaded
  only when a run names one of its lenses.
- **Engines** are every engine the configuration defines, unless the run lists its own `engines`; `--engines`
  replaces both. A **built-in engine** is part of the comparator and needs no configuration: `ref`, the reference
  engine, and `lv`, LensVisualizer itself. It can be named under any root, and is run only where it is named, so a
  root without an engine of its own runs nothing until `--engines` or the suite names one; the committed suites
  name both. A configured engine of the same id takes its place.
- **Rungs** are every rung that is judged, unless the run lists its own `rungs`; `--rungs` replaces both. They
  are, in the order of the ladder: `selftest` (the conformance quantity `selftest.echo`), `r0` (`system.describe`)
  and `r1` (`paraxial.first-order`). One more rung is run only where it is named: `rays` (`rays.trace`), which asks
  every engine to trace the run's ray sets and judges nothing. An engine that does not offer a rung's quantity is
  recorded as `unsupported` for it without being asked.
- **Ray sets.** A run of a rung that traces rays has its rays generated first, by the source of its case, for the
  run's `fields` (image-height fractions 0, 0.5 and 1 unless it states others) and `sampling.bundleGrid` (32), at
  every line of the case: LensVisualizer's own launch rays for a LensVisualizer lens, probe lattices over the first
  surface for a case file. A field that has no rays is printed with a code and recorded; the other fields are
  traced. See [Rays](#rays).
- **`--root`** names the directory that holds `lvrtc.config.json`; the default is this repository. The suite file
  and `--root` are relative to the working directory. A fixture lens in a suite is relative to the root. In every
  command an option's value may follow it as the next word or after an equals sign: `--root <dir>` or
  `--root=<dir>`.
- **The result store** is `<runsDir>/store/`, one file per answer, keyed by the request, the engine's id, its
  fingerprint, its adapter revision where it states one, and the engine options. The fingerprint is the engine's
  own code and the adapter revision the comparator's code behind a built-in engine: a change to either retires the
  answers of that engine. A result of status `ok` or `unsupported` is stored the moment it arrives; an
  `error` never is. A run that finds an answer there does not ask the engine again, so a run that was killed
  resumes by being run again, and computes only what is missing.
- **The output** is `<runsDir>/<suite name>/`: `manifest.json` and `cases/<case id>.json`. The manifest records,
  for a run with ray sets, the identity of each set and the fields that have none; the rays themselves are in the
  requests of the store. The next run of the same suite replaces it. The manifest is canonical JSON and is the
  same, byte for byte, whether results were computed or found in the store, in any directory and on any machine: it
  holds no times and no absolute paths, and of what an engine or the system said only the codes. Which jobs were
  cached, and why a job failed, is printed and not stored. A run that could not be started is recorded with the
  reason, which names files relative to the root.
- **The LensVisualizer fingerprint.** When a run's case came from LensVisualizer, the manifest records under
  `sources.lv` what the cases were built from: the checkout's `commit` and `dirty` flag and the hash and file count
  of the engine closure. When the last job has ended the checkout is read again: an engine file or an exported
  lens file whose bytes changed, or an engine closure that grew, marks the manifest `source-changed-during-run`,
  with a warning that names what changed.
- **Exit code**: 0 when no job ended as an error, every run could be started (`unsupported` is an answer, not a
  failure) and LensVisualizer did not change under the run; 1 otherwise; 2 when nothing was run because the suite
  file, an engine or a rung cannot be used as asked. A field without rays fails nothing.

This repository's own configuration defines no engine, and the committed suites name the built-in ones. The
reference engine and LensVisualizer answer `r0` and `r1` for every case of the three suites:

```bash
LVRTC_LV_PATH=/absolute/path/to/LensVisualizer node bin/lvrtc.mjs run suites/smoke.json
```

## The reference engine, and rungs R0 and R1

`ref` (`src/engines/ref`) is the comparator's own engine: small, written from the optics alone, sharing no code
with LensVisualizer or optiland, and using closed forms and IEEE 754 basic operations only, so that its answers are
the same bits on every machine. It arbitrates between the other engines, and it is the engine of the tests that
have neither. Its fingerprint is a hash of its own source files, and its adapter revision a hash of those and of
the kernels of the comparator they run on. It declares every feature of a case but an annular aperture, which its
model does not keep yet. It does not trace rays yet.

| Rung | Quantity | What is asked of every engine |
|---|---|---|
| `r0` | `system.describe` | the system it built, re-read from its own model: vertices, curvatures, conic constants, polynomial terms, clip radii, the index after every surface at every line, the stop and the image plane, and the sag of every surface at nine radii |
| `r1` | `paraxial.first-order` | per line: focal length, focal and principal points, back focus from the last lens vertex, and both pupils as the paraxial images of the stop, in position and in radius |

- **R0** is the echo: what an engine copies from the case must come back as the same numbers, with no tolerance.
  Four metrics count the elements that do not (`layout`, `shape`, `aperture` and `index.mismatches`), and each
  names the first one by field and surface, so a mistranslated surface is found before a ray is traced. Only the
  sag is computed, and it is gated relative to how large its rounding can be (`sag.maxScaled` ≤ 1e-12): the plain
  difference, `sag.maxAbs`, is shown beside it. Measured at LensVisualizer `d36f44b3`, over the 868 lenses it
  exports: `ref` and LensVisualizer's own surface profiles differ by at most 5.5e-16 on that scale, and by up to
  1.3e-10 mm in plain terms, on a surface that ends just short of a hemisphere; a gate of 1e-12 mm would fail five
  lenses on which both are right.
- **A failed R0 blocks the later rungs** for that pair of engines on that case: two engines that built different
  systems differ in everything after it, and each such difference would be the first one again. The pair is
  `BLOCKED` there, with the rung that blocks it as the reason.
- **R1** is gated at 1e-9 mm on the largest difference of any of its ten values at any line (`firstOrder.maxAbs`),
  which names the value and the line. What an engine only knows for itself, such as LensVisualizer's stored pupil
  constants, travels as `recorded`: a report lists it side by side and nothing judges it. On the Double-Gauss
  fixture `ref` gives optiland's focal length, 100.00372050801042 mm, to the last digit; its cardinal points and
  those of LensVisualizer's first-order module differ by at most 2.7e-13 mm on the benchmark and feature suites,
  and by at most 1.1e-11 mm over all 868 exported lenses (at `d36f44b3`). Its pupils and those of LensVisualizer's
  paraxial kernel, at the reference line and the five photopic lines, differ by at most 1.9e-11 mm on every lens
  but one: `viltrox-af-75mm-f12-pro` is nearly telecentric, with its exit pupil 7.7 m to 20 m away, and there the
  two differ by up to 3.0e-9 mm, which is 2e-13 of the distance. The gate is a plain 1e-9 mm, so on that lens it
  would fail two engines that are both right; it is in neither suite, and the gate is left as the plan states it.
- **No first-order data.** An afocal system and a surface with a term of power 1 are answered `unsupported`, with
  the item `system.afocal` or `surface.asphere.linear-term`.

The definitions, member by member, are in [contract/CONTRACT.md](contract/CONTRACT.md#systemdescribe).

## LensVisualizer as an engine

`lv` (`src/engines/lv/engine.ts`) is LensVisualizer answering the same quantities through the same contract, from
its own prepared state and its own functions. It is built in, like `ref`, and loads the checkout the configuration
names (`lvPath`) when it is first asked. Its fingerprint is the closure hash of LensVisualizer's engine files, so
an edit to LensVisualizer's code retires what the result store holds of it and an edit to a lens file does not.
Its adapter revision is the hash of the comparator's own code behind it (`src/engines/adapterRevision.ts`: the
engine's module and everything of the comparator it imports), so an edit to how the comparator asks LensVisualizer
retires the same answers, and the fingerprint stays LensVisualizer's.

- **It answers from LensVisualizer's state, not from the case.** For a case that came from a LensVisualizer lens,
  `lv` builds that lens again, prepares the state at the zoom and focus position the case's provenance states and
  exports it under the case's own stop radius, lines and image plane. Only when that export is the same case, by
  `systemId` and `id`, does it answer. A case that is not is a result of status `error` with the code
  `stale-case`, and the message names what differs: the lens file's hash, the engine closure, or neither, when the
  case itself was altered. A file that changed without changing the case leaves the case fresh.
- **A case from any other source is `unsupported`**, with one item of code `case-source`: LensVisualizer has no
  state for a fixture, and importing one is no part of what is compared.
- **Without a LensVisualizer the engine is unavailable**, with the code `not-configured` when no `lvPath` is set
  and `load-failed` when the path holds no LensVisualizer that can be loaded. Its jobs end as errors with that
  code, and every other engine of the run carries on.
- **R0** of `lv` is the state read back: vertices, radii, conic constants and the coefficients LensVisualizer's own
  sag evaluates, the clip limit of its `evaluateAperture` with the stop at the case's stop radius, the index table
  of its resolver for the case's lines, and the sag of its surface profile, which is NaN beyond the height at which
  the profile says the surface ends. So R0 of `lv` against `ref` holds the exporter, and the reference engine's
  reading of the case, to what LensVisualizer traces. A test against LensVisualizer's own tracer holds the echo to
  that: every hit of `traceEngineRay2` lies on the surface `lv` describes, within its intersection tolerance of
  1e-9 mm, and is clipped exactly where it lies beyond the described clip radius, the stop's included.
- **R1** of `lv` is LensVisualizer's paraxial kernel on the state's radii and gaps with the indices of each line,
  assembled as LensVisualizer assembles it: its own cardinal-point construction on the kernel's system matrix, and
  the pupils as the kernel's images of the stop. LensVisualizer's own first-order module reads the authored indices
  only; at such a line the engine's cardinal points are that module's, bit for bit, on all 868 lenses that export.
- **Recorded, never judged**: LensVisualizer's stored pupil constants, as `lvStoredEntrancePupilZ`,
  `lvStoredExitPupilZ`, `lvStoredExitPupilSemiDiameter`, `lvNominalEntrancePupilSemiDiameter` and
  `lvNominalFNumber`, at infinity focus and at a line of authored indices only. They are found with real rays or
  are nominal, and are not the paraxial images of the stop that R1 compares: on the benchmark the stored entrance
  pupil lies up to 2.5e-5 mm from the paraxial one, and the nominal entrance pupil is up to 5 % smaller than the
  image of the stop.

Measured at LensVisualizer `d36f44b3`, with `lvrtc run <suite> --engines lv,ref --rungs r0,r1` and `lvrtc compare`:

| Suite | Pairs | R0: largest sag difference | R1: largest difference |
|---|---|---|---|
| `benchmark`, 12 configurations at the reference and the photopic lines | 96 `PASS` | 3.6e-15 mm, `sony-fe-400mm-f28-gm-oss` surface 13; 4.0e-16 scaled, `sony-fe-20mm-f18-g` surface 6 | 1.6e-12 mm, the front focal point of `sony-fe-400mm-f28-gm-oss` at 470 nm |
| `features`, 16 runs with a case | 64 `PASS` | 3.6e-15 mm, `zero-asphere-ref` surface 1; 3.3e-16 scaled, `odd-asphere-ref` surface 3 | 8.5e-14 mm, the exit pupil of `fixed-iris-zoom-tele-photopic` at 610 nm |

Everything R0 holds to equality is equal: no vertex, curvature, conic constant, term, clip radius, sag radius or
index differs in any pair. The two runs of `features` that have no case say why with a code, as before. Over the
whole catalog, 1676 cases of 868 lenses, every case passes R0 and every case but two passes R1: the reference-line
case and the photopic case of `viltrox-af-75mm-f12-pro`, a nearly telecentric lens. Its exit pupil lies 7.7 m
behind the lens at the d line and 14 m in front of it at 650 nm, and the two engines place it 1.1e-9 mm and
3.0e-9 mm apart there: that is rounding, and it is above the gate. The lens is in neither suite; the entry in
[docs/gotchas.md](docs/gotchas.md) says what would judge it rightly.

## Rays

"Identical rays" in the ladder are rays that are given: every engine traces the same origins and directions, so no
engine's own sampling or aiming takes part. The quantity is `rays.trace`: n rays in, and for each ray its status
(ok, blocked or failed), the surface it ended at, its hit on every surface, its exit point and direction behind
the last surface, its landing on the image plane, and its optical path to the last surface and to the image.
Every value of a ray that did not arrive is NaN from the surface where it ended. The frame, the signs and the
rules are in [contract/CONTRACT.md](contract/CONTRACT.md#raystrace).

- **Ray sets** are made by the source of a run's case, because "the same rays as the engine under test" depends on
  where the case came from. For a LensVisualizer lens they are LensVisualizer's own launch rays
  (`src/engines/lv/raySets.ts`): the lattice its MTF lays over the beam of a field, at a fixed grid
  (`sampling.bundleGrid`), every cell as a ray of its own, the cells an aperture will stop included, with the chief
  ray after them at weight 0 and LensVisualizer's weight on each cell. Fields are fractions of LensVisualizer's
  reference image height, resolved to its solved chief-ray angles, or angles in degrees. For a case file they are
  probe lattices over the first surface and a little past its rim (`src/rays/probe.ts`), made from the case alone.
- **A set is content.** Its arrays are in the request's spec, so its hash is in the request's id: two processes
  that generate the same rays ask the same requests, and find each other's answers in the store. Nothing of a set
  is in the repository; the manifest records the identity of each.
- **`lv` traces every ray for real**, with LensVisualizer's `traceEngineRay2` and the options of its own MTF bundle,
  the indices of the case's line included, and takes LensVisualizer's own word for what stopped a ray. Its trace
  ends on the last surface: the landing is the comparator's projection (`src/estimators/imageProjection.ts`).
- **`rays`** is the rung that asks for it: `lvrtc run <suite> --engines lv --rungs rays`. Nothing compares the
  traces yet, so the rung has no entry in the policy and is run only where it is named; `lvrtc compare` refuses a
  run of it.

Measured at LensVisualizer `d36f44b3`, on the 12 benchmark configurations at the reference line, fields 0, 0.5 and
1, grid 32:

| | |
|---|---|
| ray sets, rays | 36 sets, 39 302 rays: 39 266 lattice cells and 36 chief rays |
| ok, blocked, failed | 22 918 ok (the 36 chief rays among them), 16 384 blocked, 0 failed |
| ok cells against LensVisualizer's own `traceMtfBundle` | the same count in every set, 22 882 in all; blocked and failed counts equal too |
| landing against `mtfImagePoint` | equal in every bit, on every ray that lands |
| optical path against `opticalPathLengthMm` | equal in every bit |
| the 11 441 landing rays LensVisualizer traced itself | origin, weight, landing and optical path equal in every bit |
| the 11 441 it mirrored instead | within 3.5e-13 mm of a real trace of the cell; 4493 equal in every bit |
| LensVisualizer's own golden rays (three lenses, 18 numbers) | reproduced through `traceRay2` and `traceEngineRay2` to 2.1e-17 |
| every hit against the case's own surface (the reference engine's sag) | within 1.0e-9 mm along z, which is LensVisualizer's intersection tolerance; Snell's law holds with the case's indices to 6e-14 |

On the photopic cases of the same configurations, whose reference line is 555 nm, `lv` traces 196 510 rays in 180
sets (three fields at five lines each), 114 678 of them ok and none failed. At a certified finite conjugate
(`sigma-105mm-f28-dg-dn-macro-art` at 1:1) the sets have 2305, 1801 and 1921 rays from the object point, with
weights from 0.92 to 1.01, and hold to LensVisualizer's bundle in the same way. The one lens whose glass absorbs,
`minolta-stf-135f28-t45`, has rays that weigh from 0.84 down to 0.044. A set of some 1100 rays through 30 surfaces
is about a megabyte in the store, with its answer: the 36 sets above are 43 MB.

Over the whole catalog, in one sweep outside the tests (868 exported lenses on their reference line, three fields
each): 2515 sets and 2 873 367 rays, of which 1 663 596 are ok, 1 209 771 blocked and none failed; every answer
is valid `rays.trace` data, and every ray starts 10 mm or more in front of the first surface. 53 fields and 12
lenses have no rays: the fields lie outside the modeled field, and the lenses are outside LensVisualizer's MTF
path altogether (`unsupported-path`), which is one problem for each of them.

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
  `identical-rays` or `independent-method`), whether it is `gated` or `recorded`, the tolerance or attention band
  of each metric, and whether a failure of the rung blocks the rungs after it. A gated metric has a tolerance, and
  an independent-method rung is never gated.
- **Verdicts.** `UNSUPPORTED` when either engine cannot answer; `ERROR` when either gave no result or the two
  cannot be compared; `BLOCKED` when both answered and an earlier rung that blocks later ones failed for the same
  two engines on the same case; on a gated rung `PASS` or `FAIL`, where a metric that is not a number fails; on a
  recorded rung `RECORDED`, or `ATTENTION` outside the band. Only `FAIL` and `ERROR` are failures: a blocked pair
  is not a second one.
- **Exit code**: 0 when no pair is `FAIL` or `ERROR`; 1 otherwise; 2 when nothing was compared because the run has
  no manifest or the reference is not an engine of the run.

`lvrtc report <suite name | run directory> [--root <dir>]` writes `report.json` and `report.md` into the run
directory from the manifest, the comparisons and the policy: the inputs (suite, contract version, policy version,
engines with fingerprints), the verdict counts, a support matrix of rung by engine, and for each run and rung a
reference-vs-each table, a pairwise matrix and the values the answers only record, side by side, with a note on
how to read the verdicts. A metric's cell says where its value occurs: the field and surface of a mismatch, the
quantity and line of the largest first-order difference. It exits 0 when the report
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
gives the same id, whole. The built-in engines (`src/engines/builtin.ts`: `lv`, `ref`) need no definition; one that
is given under a built-in engine's id is the engine of that id. An engine that cannot be built or reached is found
unavailable, with a code that says why: `not-configured`, `load-failed`, `spawn-failed`, `hello-failed`,
`contract-mismatch` and so on.

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

`lvrtc engine conformance <id> [--root <dir>] [--json]` checks an engine, configured or built in, against the
contract, over whatever transport reaches it: `hello` gives a valid descriptor of this contract and of the id it
was asked under; an unknown quantity is answered `unsupported`, not with an error; a malformed `run` is refused
with `ok: false`; ids are echoed; if the engine offers `selftest.echo`, the contract's examples are answered byte
for byte (a NaN with a payload, −0, the infinities, subnormals, the largest double, an empty array, a 2-D array,
scaling and summing); a repeated request gets an equal result if the descriptor says the engine is deterministic;
and `shutdown` is answered with an empty object, after which a worker process ends by itself with exit code 0.
Each check is printed `PASS`, `FAIL` or `SKIPPED` with a reason. The exit code is 0 when nothing failed, 1 when a
check did, and 2 for an id that is neither a configured nor a built-in engine.

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
