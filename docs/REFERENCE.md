# Reference

Everything the [README](../README.md) leaves out: every command's options and exit codes, how LensVisualizer is
loaded and exported, the engines, the rungs with their gates and measured results, the result store, configuration
and workers. The contract itself is in [contract/CONTRACT.md](../contract/CONTRACT.md), the plan in
[IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md), and what an engine does that a comparison has to know about in
[gotchas.md](gotchas.md).

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
prepares it for tracing at one zoom and focus position (0 to 1, default 0; for a zoom shown without `--zoom` the
error stream says that `--zoom 1` gives the tele end, and a prime has no zoom position): a row per surface with
its radius or `flat`, the gap and index after it, the clear semi-diameter and the vertex position, then the stop
surface and its runtime radius, the last lens surface, the image plane and the surface count. Rear plates are
surfaces of the prepared state and are marked `rearPlate`. A key that is not in the catalog is a usage error that
suggests the nearest keys. Both commands print to the console only.

### Cases

`lvrtc export <lensKey> [--zoom <t>] [--focus <t>] [--aperture wide-open|f/<N>|r=<mm>] [--lines reference|cdf|photopic] [--out <file>] [--root <dir>]`
writes one lens in one state as an **optical case**, the document every engine is asked about, as canonical JSON:
to `--out`, or else to the output. Without `--zoom` a zoom is exported at its wide end, and the error stream says
that `--zoom 1` gives the tele end; a prime has no zoom position, and one given for it is ignored, which is said
too. The case is built from the state LensVisualizer prepares for tracing and from the functions its own tracers
call (the clip radius of every surface, the lines and their weights, the index after every surface at every line,
the object of a certified focus station), never from authored surface fields. The mapping, member by member, is in
[contract/CONTRACT.md](../contract/CONTRACT.md#cases-from-lensvisualizer).

- **The stop.** `wide-open` is LensVisualizer's wide-open stop radius at that zoom position; `f/<N>` is its linear
  stop-down rule, `wide-open radius × widest f-number / N`; `r=<mm>` is a stop radius as given. An f-number faster
  than wide open is refused, not clamped.
- **Focus.** Infinity, or a focus position LensVisualizer certifies an object distance for. Any other focus
  position is refused: a refocused lens is never exported with its object at infinity.
- **What a case cannot express is reported with a code**, never approximated: a folded path, a mirror or a
  blocker, a diffractive surface, a tilted image plane, and what LensVisualizer itself has no data for (lines for a
  lens without dispersion data, mixed d and e references). A lens that cannot be exported as asked exits 1 with
  every reason, as `<key>: <code>: <message>`.

`lvrtc export --all [--census <dir>] [--json] [--root <dir>]` exports every lens (infinity focus, wide open, the
design image plane) on its reference line, a prime in its one state and **every zoom at both ends**, zoom 0 and
zoom 1, never stopping at a state, and prints how many lenses and states there are, how many states were exported
and how many were not, for the primes and for each end of the zooms, and by reason. `--census <dir>` writes the
**census** to `lv-export.json` and `lv-export.md` in that directory: the counts, the lens keys under each reason
(a zoom once, with its end where the reason applies to one end only), the feature flags and limits of the
exported cases, and the LensVisualizer commit and engine closure hash it was taken of. The committed one is in
[reports/census/](../reports/census/lv-export.md); it is a snapshot, holds no surface data and is asserted nowhere.
Rewrite it with `node bin/lvrtc.mjs export --all --census reports/census`.

### Suites

Three suites of LensVisualizer lenses are in `suites/`. None names a rung: a run uses every rung of the ladder.

**A zoom is compared at both ends wherever no position is stated.** A run of a zoom lens without `state.zoomT`
is two runs, `<name>-wide` (zoom 0) and `<name>-tele` (zoom 1), each with its own case, rays, comparisons and
report rows; a run that states `zoomT` is that one state, and a prime is unaffected. Which lens is a zoom is
LensVisualizer's answer, so the rule is applied when the suite is loaded against the checkout; the authored zoom
stations between the ends are not run unless a run states one. The contract states the rule under
[run-spec](../contract/CONTRACT.md#a-zoom-without-a-position).

Each names the built-in engines, `lv` and `ref`, as the engines of its runs, so that it runs at the root of this
repository, whose configuration defines no engine; `--engines` names others.

| Suite | Is |
|---|---|
| `smoke.json` | two small primes, one of them also on the photopic lines, and one small zoom, which states no position and so runs at both ends: five runs |
| `benchmark.json` | the 12 benchmark configurations (11 lenses, `nikon-z-24-70f4s` at both ends of its zoom), each on its reference line and on the photopic lines, in four conditions: 96 runs ([below](#the-benchmark-in-four-conditions)) |
| `features.json` | one lens for each translation path the benchmark lacks, named after the path: an odd-order asphere, an e-line lens, a term of power 20, an asphere on a flat base, an authored rear-plate rim, a fixed-iris zoom (at both ends: it states no position), an asphere without a term, a stop inside an element: 16 runs as written, 18 as run |

#### The benchmark in four conditions

The benchmark of Phase 3 is the 12 configurations wide open and at f/8, at the design plane and at
LensVisualizer's best axial focus. Each of those is a case of its own (another stop is another system, another
image plane another set of conditions), so each is a run of its own, and a baseline, which is keyed on runs as
run, has a record for each. The first 24 runs are the lenses as they open, unchanged since Phase 1; the 72 after
them state what differs:

| Run name | `aperture` | `imagePlane` | Is |
|---|---|---|---|
| `<configuration>-ref`, `-photopic` | (the default, `wide-open`) | (the default, `design`) | the lens as it opens |
| `<configuration>-best-ref`, `-best-photopic` | (`wide-open`) | `lv-best-axial` | at LensVisualizer's own best axial focus for those lines, wide open |
| `<configuration>-f8-ref`, `-f8-photopic` | `lv-f8-comparison` | (`design`) | the f/8 comparison of LensVisualizer's MTF tab, at the design plane |
| `<configuration>-f8-best-ref`, `-f8-best-photopic` | `lv-f8-comparison` | `lv-best-axial` | that comparison at its own best axial focus |

Both options are asked of LensVisualizer when the case is exported
([Cases from LensVisualizer](../contract/CONTRACT.md#cases-from-lensvisualizer)): the stop is the tab's own
scaling of its wide-open radius, and the plane the one LensVisualizer's focus search finds for that stop and those
lines. So the best focus of a lens is four different planes here, and the tab offers f/8 for every lens of the
benchmark (each is faster than f/7.95 wide open and stops down to f/8 or beyond; measured at `33ebdb30`). The 96
cases are of 24 systems. The feature suite and the smoke suite stay as they were.

Two translation paths have no run, because no lens of the catalog has a case for them: the one lens that mixes d
and e references has no wavelength data for every glass (`mixed-reference`), and every lens with an annular
aperture is a mirror lens (`folded-path`). A run that can never have a case would only make the suite fail. An
integration test exports those lenses and fails on the day one of them has a case
([docs/gotchas.md](gotchas.md)).

## Running a suite

`lvrtc run <suite.json> [--root <dir>] [--engines <id,...>] [--rungs <id,...>] [--json]` runs a suite: for every
run, every selected rung and every selected engine, it asks the rung's requests of the engine and records how each
job ended. The fixture suite of the README's quick start needs neither LensVisualizer nor optiland: its root,
`test/fixtures/fake-root`, defines six fake engines, four in this process and two, `fake-py` and `fake-pyn`, Python
workers, and its suite names one rung, `selftest`, which asks for the conformance quantity `selftest.echo`. Without
Python, add `--engines fake-a,fake-b,fake-none`.

- **Lenses.** A run names an optical-case file (`{ "kind": "fixture", "path" }`) or a LensVisualizer lens
  (`{ "kind": "lv", "key" }`), whose case is exported from the configured checkout (`lvPath`) in the state, at the
  aperture, on the lines and at the image plane the run states, exactly as `lvrtc export` does. A lens that cannot
  be exported as asked is a run that is not started, with the exporter's coded reasons. LensVisualizer is loaded
  only when a run names one of its lenses.
- **Engines** are every engine the configuration defines, unless the run lists its own `engines`; `--engines`
  replaces both. A **built-in engine** is part of the comparator and needs no configuration: `ref`, the reference
  engine, `lv`, LensVisualizer itself, `optiland`, `replay`, the comparator's estimators on a replay of
  LensVisualizer's sampling, and `wave`, its wave estimator on LensVisualizer's rays. It can be named under any
  root, and is run only where it is named, so a root without
  an engine of its own runs nothing until `--engines` or the suite names one; the committed suites name `lv` and
  `ref`. A configured engine of the same id takes its place.
- **Rungs** are every rung, unless the run lists its own `rungs`; `--rungs` replaces both. They are, in the order
  of the ladder: `selftest` (the conformance quantity `selftest.echo`), `r0` (`system.describe`), `r1`
  (`paraxial.first-order`), `r2`, `r3` and `r4` (`rays.trace`), which ask every engine to trace the run's ray
  sets, `r4f` (`mtf.native`), `r6a` (`rays.trace`) and `r6b` (`mtf.native`). `r2`, `r3` and `r4` ask the same
  requests, so an engine traces a set once and the later rungs find the answer in the store; `r4` asks them only
  of a run that has an MTF recipe ([below](#rung-r4-the-geometric-mtf-of-the-same-rays)). `r6a` asks them too, and
  after them the same fields on a lattice twice as fine, which every engine has to trace for it: four times the
  rays of the other rungs together, so a run that names no rungs is a long one on a suite of real lenses
  ([below](#rungs-r6a-and-r6b-the-wave-mtf)). An engine that does not offer a rung's quantity, or implements
  another version of
  its definition than the comparator's, is recorded as `unsupported` for it without being asked.
- **A rung of its own engines.** `r4f` is no comparison between the engines of a run: it holds `lv` to `replay`
  ([below](#the-mtf-recipe-the-replay-and-rung-r4f)). It is asked of exactly those two, whatever `--engines` and
  the run name, so `--engines lv,ref,optiland --rungs r0,r1,r2,r3,r4f` runs the first four rungs on three engines
  and the fifth on its two, and no engine is recorded as `unsupported` for a rung that was never about it. In a
  comparison such a rung is not held to a reference that is none of its engines. `r6b` is the second such rung:
  it sets `lv` beside `wave`, the comparator's wave estimator on LensVisualizer's rays.
- **The MTF recipe.** A run of a rung that is made from the recipe (`r4`, `r4f`, `r6a`, `r6b`) has it resolved
  first, by the source of
  its case: the plane, the fields, the lines and the frequencies every MTF request about the case is made from
  ([the contract](../contract/CONTRACT.md#the-mtf-recipe)). The manifest records it, or why the run has none. A
  run without one has no request of such a rung, and nothing fails.
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
reference engine and LensVisualizer answer `r0` to `r3` for every case of the three suites:

```bash
LVRTC_LV_PATH=/absolute/path/to/LensVisualizer node bin/lvrtc.mjs run suites/smoke.json
```

## The reference engine, and rungs R0 and R1

`ref` (`src/engines/ref`) is the comparator's own engine: small, written from the optics alone, sharing no code
with LensVisualizer or optiland, and using closed forms and IEEE 754 basic operations only, so that its answers are
the same bits on every machine. It arbitrates between the other engines, and it is the engine of the tests that
have neither. Its fingerprint is a hash of its own source files, and its adapter revision a hash of those and of
the kernels of the comparator they run on. It declares every feature of a case, and answers `system.describe`,
`paraxial.first-order` and `rays.trace`; its tracer is under [Rays](#rays).

| Rung | Quantity | What is asked of every engine |
|---|---|---|
| `r0` | `system.describe` | the system it built, re-read from its own model: vertices, curvatures, conic constants, polynomial terms, clip radii and the inner radii of annular apertures, the index after every surface at every line, the stop and the image plane, and the sag of every surface at nine radii |
| `r1` | `paraxial.first-order` | per line: focal length, focal and principal points, back focus from the last lens vertex, and both pupils as the paraxial images of the stop, in position and in radius |

- **R0** is the echo: what an engine copies from the case must come back as the same numbers, with no tolerance.
  Four metrics count the elements that do not (`layout`, `shape`, `aperture` and `index.mismatches`), and each
  names the first one by field and surface, so a mistranslated surface is found before a ray is traced. Only the
  sag is computed, and it is gated relative to how large its rounding can be (`sag.maxScaled` ≤ 1e-12): the plain
  difference, `sag.maxAbs`, is shown beside it. Measured at LensVisualizer `d36f44b3`, over the 868 lenses it
  exports: `ref` and LensVisualizer's own surface profiles differ by at most 4.3e-16 on that scale, and by up to
  1.3e-10 mm in plain terms, on a surface that ends just short of a hemisphere; a gate of 1e-12 mm would fail four
  lenses on which both are right. `ref` sums a surface's polynomial with the rounding error of every product and
  addition carried along, so its sag is the exact sum rounded once, however far the terms cancel.
- **A failed R0 blocks the later rungs** for that pair of engines on that case: two engines that built different
  systems differ in everything after it, and each such difference would be the first one again. The pair is
  `BLOCKED` there, with the rung that blocks it as the reason.
- **R1** has three gates of 1e-9 mm. `firstOrder.maxAbs` is the largest difference of the six values that are
  neither the position nor the radius of a pupil, at any line, and names the value and the line. The position of a
  pupil is judged on the scale of its distance from the image plane: `pupilZ.maxScaled` is the plain difference for
  a pupil within a metre of it, and 1e-12 of the distance beyond; the plain figure, `pupilZ.maxAbs`, is shown beside
  it. A pupil 20 m away is a quotient that no arithmetic in doubles places to 1e-9 mm. The radius of a pupil is the
  stop's radius times the same quotient, so it is judged on the same scale, the distance of the pupil it is the
  radius of: `pupilRadius.maxScaled`, with `pupilRadius.maxAbs` beside it. The radius of a pupil within a metre of
  the image plane keeps the plain 1e-9 mm, and a pupil at the same infinity in both engines is equal, in position
  and in radius (the plan, "Amendments since approval"). What an engine only knows for itself, such as
  LensVisualizer's stored pupil constants, travels as `recorded`: a report lists it side by side and nothing judges
  it. On the Double-Gauss fixture `ref` gives optiland's focal length, 100.00372050801042 mm, to the last digit; its
  cardinal points and those of LensVisualizer's first-order module differ by at most 2.7e-13 mm on the benchmark and
  feature suites, and by at most 1.1e-11 mm over all 868 exported lenses (at `d36f44b3`). Its pupils and those of
  LensVisualizer's paraxial kernel, at the reference line and the five photopic lines, differ by at most 1.9e-11 mm
  on every lens but one: `viltrox-af-75mm-f12-pro` is nearly telecentric, with its exit pupil 7.7 m to 20 m away,
  and there the two differ by up to 3.0e-9 mm, which is 2e-13 of the distance and passes on that scale.
- **No first-order data.** An afocal system and a surface with a term of power 1 are answered `unsupported`, with
  the item `system.afocal` or `surface.asphere.linear-term`. A term of power 2 is curvature at the vertex, which
  `ref` counts; an engine whose own paraxial model reads the radius alone, as LensVisualizer's kernel and
  optiland's tracer do, answers `unsupported` with the item `surface.asphere.quadratic-term`, never with the focal
  length of the lens without the term. optiland also has no first-order data of a system whose entrance pupil is
  at infinity ([below](#the-engine-optiland)).

The definitions, member by member, are in [contract/CONTRACT.md](../contract/CONTRACT.md#systemdescribe).

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
  A case with a term of power 1 or 2 would be answered `unsupported`: the kernel is handed radii alone. No lens
  has one, since LensVisualizer's coefficients start at `A3`.
- **Recorded, never judged**: LensVisualizer's stored pupil constants, as `lvStoredEntrancePupilZ`,
  `lvStoredExitPupilZ`, `lvStoredExitPupilSemiDiameter`, `lvNominalEntrancePupilSemiDiameter` and
  `lvNominalFNumber`, at infinity focus and at a line of authored indices only. They are found with real rays or
  are nominal, and are not the paraxial images of the stop that R1 compares: on the benchmark the stored entrance
  pupil lies up to 2.5e-5 mm from the paraxial one, and the nominal entrance pupil is up to 5 % smaller than the
  image of the stop.

Measured at LensVisualizer `d36f44b3`, with `lvrtc run <suite> --engines lv,ref --rungs r0,r1` and `lvrtc compare`:

| Suite | Pairs | R0: largest sag difference | R1: largest difference |
|---|---|---|---|
| `benchmark`, 12 configurations at the reference and the photopic lines | 96 `PASS` | 3.6e-15 mm, `sony-fe-400mm-f28-gm-oss` surface 13; 4.0e-16 scaled, `sony-fe-20mm-f18-g` surface 6 | 1.6e-12 mm, the front focal point of `sony-fe-400mm-f28-gm-oss` at 470 nm; of a pupil's position 3.4e-13 mm |
| `features`, 18 runs with a case (its zoom at both ends; measured again at `ed78cf40`) | 72 `PASS` | 3.6e-15 mm, `zero-asphere-ref` surface 1; 2.7e-16 scaled, `odd-asphere-ref` surface 1 | 5.3e-14 mm, the front focal point of `odd-asphere-photopic` at 610 nm; of a pupil's position 8.5e-14 mm, the exit pupil of `fixed-iris-zoom-photopic-tele` |

Everything R0 holds to equality is equal: no vertex, curvature, conic constant, term, clip radius, sag radius or
index differs in any pair. Over the whole catalog, 1676 cases of 868 lenses, every case passes R0 and R1.
`viltrox-af-75mm-f12-pro` is nearly telecentric: its exit pupil lies 7.7 m behind the lens at the d line and 14 m
in front of it at 650 nm, and the two engines place it 1.1e-9 mm and 3.0e-9 mm apart there, which on the scale of
its distance is 1.4e-10 and 2.1e-10 and passes. The radius of that pupil is 6.3 m at 650 nm, of which the two
hold 1.35e-9 mm apart, 2e-13 of it: on the scale of the pupil's distance 9.4e-11, which passes since the radius of
a pupil is judged as its position is (policy version 4; measured at `1ed8cc3d`, engine closure `ff670f03`). Before
that it was the one case of the catalog that failed R1. The lens is in neither suite; see
[docs/gotchas.md](gotchas.md).

## Rays

"Identical rays" in the ladder are rays that are given: every engine traces the same origins and directions, so no
engine's own sampling or aiming takes part. The quantity is `rays.trace`: n rays in, and for each ray its status
(ok, blocked or failed), the surface it ended at, its hit on every surface, its exit point and direction behind
the last surface, its landing on the image plane, and its optical path to the last surface and to the image.
Every value of a ray that did not arrive is NaN from the surface where it ended. The frame, the signs and the
rules are in [contract/CONTRACT.md](../contract/CONTRACT.md#raystrace).

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
- **`ref` traces every ray to rounding** (`src/engines/ref/trace.ts`), by analytic geometry and Snell's law: a
  plane and a conic are met in closed form, by the root of the quadratic that has no cancellation in it and lies on
  the sag's own sheet; a conic with a polynomial by Newton's method from the conic's hit, on a form of the surface
  that has no square root, carried to a fixed point in double precision; refraction as vectors, split across and
  along the normal so that nothing cancels; and the optical path as a compensated sum. Where Newton's method does
  not settle on a hit within the clear aperture, the line's stretch inside the aperture is scanned for its
  crossings of the sag, by the sag's sign and its slope, and the crossing nearest the vertex plane is the hit, as
  for a conic: a line that cuts a surface twice, or only grazes it, is met and not lost. A ray that misses a
  surface, is totally reflected or no longer travels toward +z is blocked; one whose crossing it cannot decide is
  failed, never blocked. Where two neighbouring surfaces cross it steps backwards, as a sequential trace does.
  Its proof is analytic (`test/engines/ref/trace.test.ts`): a plate, one sphere by hand, the aplanatic points of a
  sphere at every aperture, Cartesian ellipsoid and hyperboloid with equal paths to their focus, the paraxial
  limit, aspheres against a bisection of the contract's own sag and refracted by the slope of that sag, lines that
  cut a surface twice or graze it, apertures to one unit of rounding, skew rays by their invariant.
- **`optiland` traces every ray with optiland's own tracer** (`workers/python/lvrtc_optiland/trace.py`): the rays
  go into its `RealRays` bit for bit, and what it records on each surface is the answer. optiland says of a ray
  only whether it still carries light, so the worker says why a ray ended only where optiland's numbers show it,
  and answers a ray optiland keeps as optiland has it. The optical path is optiland's own sum of index times
  step, with each step made the length the contract counts. See [the engine `optiland`](#the-engine-optiland).
- **`r2` and `r3`** are the rungs that ask for it and compare the answers: `lvrtc run <suite> --rungs r2,r3`. See
  [the two rungs](#rungs-r2-and-r3-and-the-floor) below.

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

### Rungs R2 and R3, and the floor

| Rung | Compares, on the rays that are ok in both engines | Gate |
|---|---|---|
| `r2` | the hit of every ray on every surface (`hits.maxDistance`), the direction behind the last surface (`direction.maxAbs`), the landing on the image plane (`landing.maxDistance`); and which rays got through (`mask.mismatches`) | 1e-8 mm, 1e-9, 1e-8 mm; 0 rays |
| `r3` | the optical path to the last surface, to the image plane, and relative to the chief ray's (`opticalPath.maxAbs`, `opticalPathToImage.maxAbs`, `opd.maxAbs`), in waves of the line | 2e-5 waves |

- **The mask.** A ray that one engine stopped at a surface the other let it pass is a mismatch, unless the hit of
  the engine that passed it lies within 1e-8 mm of that surface's clip radius, or of the radius of its central
  obstruction: the rim band, where each engine has placed the hit to its own tolerance. Rim-band rays are counted
  (`mask.rimBand`) and not judged. A ray either engine failed is in neither count; how many rays of each engine
  are ok, blocked and failed is listed beside the comparison.
- **The chief ray.** `opd.maxAbs` needs a chief ray that is ok in both engines. Where there is none it is not
  measured, the pair says so, and the two raw paths are judged alone.
- **`FLOOR`.** LensVisualizer meets a surface within 1e-9 mm of it, and a steep surface behind makes more of that.
  A pair of `lv` that is above a gate is `FLOOR`, a pass that is counted apart, when `lv` is within 1e-7 mm, 1e-8
  in direction and 2e-4 waves of the arbiter `ref`: ten times each gate. Otherwise it is `FAIL`. Every one of
  those figures is held together, whichever is above its gate: a direction within its limit excuses no hit beyond
  its own. The limits are in `policy/rungs.v1.json`. A mask mismatch has no floor: a ray that one engine stopped
  and the other passed always fails. Every other engine is a **witness** (policy version 5). Within 1e-10 mm,
  1e-12 in direction and 1e-7 waves of `ref` it corroborates the arbiter, and the reason says by how much. Beyond
  that it does not, and withholds nothing: the pair is still `FLOOR`, and the reason says "the witness did not
  corroborate" with the witness's own distance from `ref`. Only a witness that is beyond that agreement and
  nearer to `lv` than to `ref` blocks the floor: the pair is `FAIL`, "arbiter-suspect". And in the pair of `lv`
  with a witness, an excess where the witness is as far from `ref` as `lv` is, or farther, is the witness's and no
  floor ([the engine `optiland`](#the-engine-optiland)).

Measured at LensVisualizer `3af45e3f` (the engine files of `d36f44b3`), with
`lvrtc run <suite> --engines lv,ref --rungs r0,r1,r2,r3`, `lvrtc compare` and `lvrtc report`:

| Suite | Pairs of R2 and R3 | R2: largest hit, direction, landing | R3: largest path, to image, relative |
|---|---|---|---|
| `benchmark`, 216 ray sets, 137 596 rays ok in both | 864 `PASS` | 6.8e-9 mm, 3.1e-10, 9.1e-9 mm: `sigma-35mm-f14-dg-hsm-a` at 650 nm, 31.9° | 6.0e-6, 5.3e-6, 5.5e-6 waves |
| `features`, 162 ray sets with its zoom at both ends, 104 846 rays ok in both (measured again at `ed78cf40`) | 640 `PASS`, 8 `FLOOR` | 2.3e-9 mm; 2.1e-10 and 1.10e-8 mm, `zeiss-hologon-15f8` at 470 nm, 55.3° | 3.8e-6 waves; 2.07e-5 and 2.28e-5 waves, that ray of the Hologon |

A pair is counted in both modes, as `lvrtc compare` counts it, so the eight floors are four comparisons: R2 and R3
of the Hologon at its full field, at 470 nm and 510 nm, where the rays leave 54° off the axis. Traced in 60-digit
arithmetic, `ref` is within 6e-15 mm and 2e-11 waves of the truth on the worst of those rays, and LensVisualizer
the rest. Not one ray of either suite is stopped by one engine and passed by the other, in the rim band or outside
it, and none is failed by either. Over the whole catalog, in a sweep outside the tests (14 370 ray sets at
`1ed8cc3d`), R2 has 14 235 `PASS`, 53 `FLOOR` and 82 `FAIL`, and R3 14 345, 24 and 1. The lenses that fail R2 do
so because LensVisualizer loses rays where two neighbouring surfaces cross (77 pairs on six lenses; two more
zooms do so at their tele end only), or because a steep surface carries its tolerance past what the floor allows
(five pairs on three lenses). Both are findings about LensVisualizer, and both are in
[docs/gotchas.md](gotchas.md). Until policy version 4 a direction had no floor, and 14 more pairs failed by it
alone.

**The committed record** is the baseline of each suite and the report rendered from it
([Baselines](#baselines)): [reports/benchmark/rays.md](../reports/benchmark/rays.md) has the pair of `lv` and
`ref` beside the pairs of each with optiland. It replaced `reports/benchmark/lv-floor.md`, the digest of Phase 1;
`lvrtc report --floor <dir>` still writes that digest of any run, for reading, and nothing of it is committed.
`test/integration/lv/rungs.test.ts` holds the baseline's records of `lv` and `ref` to a fresh run of the two for
as long as both engines and the cases are the ones the baseline names.

## Estimators

An estimator is the comparator's own arithmetic on a trace: pure functions in `src/estimators`, applied alike to
every engine's answer for the same rays, so that two engines never differ by how each turns rays into a figure.
They read no engine and no file and use only IEEE 754 basic operations (`+ - * /` and square root), so equal input
gives equal bits on any machine. The error-free sums they share with `ref` are in `src/core/numeric/exact.ts`: in
the adapter revision of whatever reaches them, in no engine's fingerprint. Two rungs take the geometric transfer
function: R4f, on a replay of LensVisualizer's sampling, and R4, on every engine's trace of the same rays. The
wave transfer function has [a section of its own](#the-wave-otf).

- **The image projection** (`imageProjection.ts`) lands a ray that left the last surface: the point of its line on
  the image plane, and the length of that stretch, which the optical path to the image is charged with. The length
  is the line's parameter times the length of the direction (`lengthOf`, in two doubles), rounded once, whatever
  that length is: a direction is a unit vector to a rounding at best
  ([docs/gotchas.md](gotchas.md#a-direction-is-a-unit-vector-to-a-rounding-and-a-stretch-is-charged-by-its-length)).
- **The geometric OTF** (`geometricOtf.ts`) is the sum over the rays that land, with no bin and no transform, at
  any frequency in cycles a millimetre:

  `OTF(nu) = sum of w exp(-2 pi i nu (u - u_ref)) / sum of w`

  `geometricOtf(spots, reference, frequencies)` gives both cuts: `sagittal` with `u` along image x, `tangential`
  with `u` along image y, each as real part, imaginary part and modulus (the MTF) at every frequency. `spots` are
  the landings `x`, `y` and the weights of the rays, the flux each carries; a ray of weight 0, as a chief ray, adds
  nothing. `reference` is one point of the image plane. These are the conventions of LensVisualizer's
  `geometricOtf`, read there and restated
  ([docs/gotchas.md](gotchas.md#the-geometric-otf-is-a-sum-about-the-chief-ray-of-the-first-line-and-its-magnitude-is-cut-off-at-1)).
- **A spectrum** (`polychromaticOtf(lines, reference, frequencies)`) adds its lines up as complex numbers before
  any modulus: the sum over the lines of weight times a line's own sum (`spotSums`), over the sum of weight times
  the flux of the line's rays, every line about the **same** reference. Lateral colour therefore lowers the
  modulus, and a line whose rays carry less flux counts for less. Two lines that land `d` apart give
  `|cos(pi nu d)|` when they count alike.
- **The arithmetic.** The phase of a ray is reduced before it is an angle: the cycles `nu (u - u_ref)` are formed
  with the rounding of the subtraction and of the product carried along, whole and quarter cycles are taken off
  exactly, and the sine and cosine of the eighth of a cycle that is left are Taylor polynomials. Every sum is
  compensated. A value is within 1e-15 of the sum taken exactly, at a phase of a hundredth of a cycle as at ten
  million (measured against the definition in whole numbers: 2.2e-16 at worst over 20 000 single rays, 1.1e-16
  over sums of 200); at frequency 0 it is exactly 1; a spot a whole number of quarter cycles from the reference
  gives exactly 1, -1 or 0. A value does not depend on which other frequencies were asked. The modulus is not cut
  off at 1. 65 536 rays at three frequencies take 20 ms.
- **Unavailable, never NaN.** What cannot be computed is `{ available: false, reason, message }`, with the index
  of the ray or the line it is about, and holds no number:

  | Reason | When |
  |---|---|
  | `bad-frequency` | a frequency is not a finite number |
  | `no-reference` | the reference is no finite point: a chief ray that did not land has none |
  | `bad-landing`, `bad-weight` | a ray that is taken has a landing that is not finite, or a weight that is not a finite number of at least 0 (the first such ray) |
  | `no-rays` | no ray is taken |
  | `no-flux` | the rays taken all weigh 0 |
  | `out-of-range` | a ray more than 2^32 cycles of phase from the reference (`MAX_PHASE_CYCLES`; it is named), or a sum that is no finite number |
  | `no-lines`, `bad-line-weight` | a spectrum without a line; a line whose weight is not a finite number above 0 |

  The request is looked at first, then the rays in their order. In a spectrum every line must have an answer of
  its own: a line without a valid ray or without flux makes the whole sum unavailable and is named (`line`), since
  a spectrum from which a line is missing is another spectrum. Arrays of unequal length are an error, not an
  outcome.
- **Rays valid in every engine** (`validity.ts`). `spots.valid` is a mask, 0 for a ray that is left out, and a ray
  that is left out is not looked at (its landing is NaN in a trace). `maskWhere(status, ok)` is the mask of one
  answer and `intersectValidity(masks)` the rays every engine brought to the image, so that one estimator is
  applied to the same subset of every engine's bundle.

The proof is analytic (`test/estimators`): two points against a cosine, N equally spaced points against the
Dirichlet kernel, a uniform line of 2000 rays against the sinc within the bound of the midpoint rule (below 5e-7),
a uniform disc of 14 400 rays in rings of equal area against `2 J1(z) / z` within a bound derived from the
Jacobi-Anger expansion and the midpoint rule (below 4e-5), a shift that changes the phase alone, weights, symmetry,
the two axes, two lines `d` apart, unequal flux, the common reference, and the definition itself carried out in
ninety digits of whole-number arithmetic.

### The wave OTF

`src/estimators/waveOtf.ts` is the comparator's wave estimator: Hopkins' formula, the autocorrelation of the pupil
function, from the optical paths of a bundle traced on a lattice. Rungs R6a and R6b apply it
([below](#rungs-r6a-and-r6b-the-wave-mtf)).

`waveOtf(bundle, reference, frequencies)` gives the `sagittal` cut (frequency along image x) and the `tangential`
one (along image y) as the geometric estimator does, at any frequencies, with `phaseStep` and `undersampled`
beside them; `polychromaticWaveOtf(lines, reference, frequencies)` adds the lines of a spectrum; `pupilFunction`
shows the pupil it autocorrelates; `waveOtfSums` gives the sums before they are divided.

- **The input is a `rays.trace` request and an answer to it, as decoded** (`TracedLattice`): the weights of the
  request; of the answer either `imagePoint` with `opticalPathToImage` or `exitPoint` with `opticalPath` (`point`,
  `path`: any point of a ray behind the last surface and the path to it; the image point is the better conditioned)
  and `exitDirection`; a mask of the rays valid in every engine; the wavelength of the line and the index of the
  image space there; and `launchPath`, from `launchPaths(origins, directions, conditions.object)`. Which ray is
  which cell is `groups.lattice` of the set: ray `row * columns + column`, and whatever follows the cells (the
  chief ray) is not looked at. Neither the lattice's step nor a chief ray is needed. `reference` is a point of the
  image plane with its z: for two engines, one both can form, as rung R4's is.
- **The pupil coordinate** is the optical direction cosine at the image side, `c = (n L, n M)`. A frequency `nu`
  shears the pupil by `lambda nu` in these units, with `lambda` the vacuum wavelength, wherever the exit pupil is.
- **The path** of a cell is `W = launch + path + n d . (R - Q)`: the optical path from the incident wavefront to
  the foot of the perpendicular dropped on the ray from the reference point `R`. A ray that is late has the larger
  `W`; a ray that lands at `x` has `dW/dc = -(x - x_ref)`, so the phase is `-2 pi nu (x - x_ref)` for a small
  shear, the geometric estimator's convention. A piston is of no account. Moving the reference adds a tilt that is
  exactly linear in `c`: it turns the phase and leaves the modulus alone, to a rounding.
- **The launch path** is what a ray's `opticalPath`, which starts at 0 at its origin, lacks: from an object at
  infinity the projection of the origin on the ray's direction, from an object plane the length of the ray from
  that plane to its origin. It needs no ray the set does not hold.
- **The modulus** is `sqrt(w / J)`: the flux of a cell (the weight of the request, and no other apodisation) over
  the area `J` of cosine space the cell covers, by central differences of its neighbours' cosines. No obliquity
  factor is applied.
- **The sum** is a midpoint rule over cosine space with each lit cell a node of weight `J`, once as the lower and
  once as the upper end of a pair, so the value at `-nu` is the conjugate in every bit. The other end of a pair is
  looked for in both coordinates: a row of the lattice is no line of constant cosine. It lies in a patch, the
  square between four neighbouring cells; the patches with a lit corner are kept by where they lie in cosine
  space, and the point is found in its patch by Newton's method on the patch's bilinear map. No search crosses
  dark cells, so a hole or a vignetted crescent costs no pair. Modulus and path there are bilinear interpolants;
  the path is never wrapped. The phasors are added by the geometric estimator's `spotSums`, so the value at
  frequency 0 is exactly 1 and the arithmetic is IEEE 754 basic operations only.
- **The rim.** A lattice has no partial cells: the pupil is the staircase of its lit cells, and on an even lattice
  of uniform flux the estimate is the autocorrelation of that staircase to a rounding. Against the true aperture
  the error is of first order in the cell, at most `3 e / (1 - e)` with `e` the area between the two over the
  aperture's (`e <= 4 sqrt(2) / n` for a disc `n` cells across); measured, it falls as `n^-1.5`. Inside the rim the
  rule is of second order. Beyond the cut-off of the lit cells a value is exactly 0.
- **Validity.** `phaseStep` is the largest step of `W` between two lit cells that are neighbours in a row or a
  column, in waves, with the two rays; `undersampled` is true above a quarter wave (`QUARTER_WAVE`), where the
  phase of a pair may turn by more than half a cycle from one cell to the next: such an estimate is not to be used
  as an arbiter. The step includes the tilt of a reference that lies beside the spot. `gridConvergence(coarse,
  fine)` is the largest difference of the MTFs of two estimates of one bundle on two lattices.
- **Unavailable, never NaN**: the reasons of the geometric estimator (`bad-frequency`, `no-reference`,
  `bad-weight`, `no-rays`, `no-flux`, `out-of-range`, `no-lines`, `bad-line-weight`) and three of its own:
  `bad-line` (a wavelength or an index that is not finite and above 0), `bad-ray` (a point, direction or path of a
  ray that is taken is not finite) and `degenerate-pupil` (the lit cells lie on one line of the lattice, or the map
  from cells to cosines folds: such a pupil has no single pupil function).

The proof is analytic (`test/estimators/waveOtf.test.ts`), on spherical waves built from their geometry:

| Control | Expected value, derived in the test | Measured |
|---|---|---|
| clear disc, 32 to 256 cells across | `2/pi (acos s - s sqrt(1 - s^2))`, within the rim's bound (0.64 to 0.068) | 3.2e-3, 1.2e-3, 5.9e-4, 1.3e-4 |
| the same, and a lattice turned by 30 degrees, mirrored, with a notch | the autocorrelation of the staircase, from counts of pairs of cells | within 1e-12 |
| annulus, obscuration 0.4, 128 cells | areas shared by discs, in closed form | 1.4e-3 (bound 0.24) |
| defocused square pupil, half a wave, 32 / 64 / 128 cells | Hopkins' integral by a 96-point Gauss-Legendre rule, within a bound of second order (0.15 / 0.036 / 0.0087) | 4.3e-4, 9.0e-5, 3.8e-5 |
| defocused disc, 0.4 waves, 128 cells | the same integral over the lens between two circles | 4.6e-4 (bound 0.14) |
| a lattice whose cells are seven times as wide at its sides as amid it | the triangle `1 - s`: the modulus is flux over area | exact across, 3.8e-4 along |
| disc and annulus on a lattice with pupil aberration (a sheared point lies cells from where the local slope puts it), 64 and 128 cells | the closed forms, the flux of a cell being its area | 2.2e-3 and 3.6e-3; 9.6e-4 and 1.3e-3 |
| tilt of six waves, on an even and on a warped lattice | the phase `exp(-2 pi i nu d)` and the same modulus | within 1e-9, the rounding of the paths |

and the cut-off, the two axes, a wave in glass, the quarter-wave flag at steps of 0.22 and 0.27 waves, two lines
with lateral colour, the launch path, and every outcome. An estimate of a bundle 32 cells across at three
frequencies takes 6 ms; of one 128 across, 50 ms.

How LensVisualizer's own two wave estimates differ is in
[docs/gotchas.md](gotchas.md#lensvisualizer-has-two-wave-estimates-and-the-one-it-shows-reads-no-optical-path).

## LensVisualizer's product MTF

`mtf.native` is the quantity for an engine's own MTF: by its own method, sampling and aiming, as it presents it.
No two independent engines are expected to agree on it within a tolerance, and no rung compares two of them yet.
LensVisualizer's is the one every later comparison is against, so it has to be obtained exactly as LensVisualizer
obtains it, and the comparator has to understand how LensVisualizer samples it: that is rung R4f
([below](#the-mtf-recipe-the-replay-and-rung-r4f)).

`lvrtc mtf <lensKey> [--engines <id,...>] [--profile <name>] [--zoom <t>] [--aperture wide-open|f/8] [--root <dir>] [--json]`
asks each named engine (`lv` unless others are named) for its MTF of a LensVisualizer lens, as a profile requests
it, and prints what each answered: a row per field with the image height, the field angle, the status and the
sagittal and tangential MTF at the frequencies the profile shows, then the engine's method and its settings, the
focus shift it applied, the f-number it traced and the surface that limits the axial beam, the lines it computed
with and its notes. With one engine it only presents; setting engines against each other is Phase 3, and adds
nothing to this command line.

**A zoom is asked about at both ends.** Without `--zoom`, a zoom lens gets two requests, two tables and two run
directories, the wide end (zoom 0) and then the tele end (zoom 1), each table under a line that says which end it
is (`state    zoom 1 (tele), infinity focus`); `--zoom <t>` asks about that one position, and what it prints and
writes for `--zoom 1` is the tele part of the two, bit for bit. A prime has one state; a `--zoom` given for it is
ignored, and the error stream says so. With `--json` both ends are one object, the record of each end under
`wide` and `tele`.

- **The profile `lv-tab-default`**, the default, is the request LensVisualizer's MTF tab makes for a lens as it
  opens. Its method, spectrum, focus mode, grid cap, field spacing and shown frequencies are LensVisualizer's own
  `DEFAULT_MTF_PREFERENCES`, read when the command runs: today the diffraction estimate on the photopic spectrum
  at best axial focus, a grid cap of 128, fields at 10 % steps of the image height, 51 frequencies from 0 to 100
  cycles/mm, of which the tab draws 10 and 30. A lens without the glass data for the spectrum is asked on its
  reference line, as the tab asks it, and the answer's first note says so.
- **The two radii are the hook's.** The stop radius and the pupil radius, which seeds the scan that finds a
  field's beam, are computed as LensVisualizer's own React hook computes them for the tab, in its order of
  operations: `(wide-open iris × widest f-number) / f-number` and `(entrance pupil of that iris × widest f-number)
  / f-number`. The seed matters: LensVisualizer's audit scripts pass the lens's nominal pupil instead, and get
  another MTF, by 0.006 to 0.008 on the three benchmark lenses a test asks it of and by 0.003 to 0.013 over the
  twelve configurations, measured once outside the tests.
- **`--aperture f/8`** is the tab's own comparison at f/8: both radii of the wide-open request times `N / 8`. A
  lens the tab offers no such comparison for (not faster than f/7.95, or not stopping down to f/8) is answered
  `unsupported`, with the reason, and the command says so on its `profile` line. A lens that is f/8 wide open is
  scaled by 8 / 8: its comparison is its wide-open case, and that is what is answered. The tab reaches any other
  aperture only through its slider, so the profile has no request for one.
- **The case** every engine is asked about is built by the profile: the lens at the zoom position, at infinity
  focus, with the tab's stop radius and on the lines of the tab's spectrum. For 11 of the 12 benchmark
  configurations it is the very case the benchmark suite runs on the photopic lines; for `nikon-z-mc-105f28` the
  tab's stop radius is one unit in the last place from the iris of the prepared state, so its case is another
  ([docs/gotchas.md](gotchas.md)). `lv` builds the tab's request again from the case it is handed, and
  refuses the profile for a case that is not the tab's: on other lines than the spectrum the tab resolves for the
  lens, or with another stop radius, the answer is the error `bad-spec`, which says what to export instead. So is
  a spec that names the profile and states other frequencies, fields, method or focus than the tab's.
- **A lens LensVisualizer shows no MTF for** (a fisheye, an annular aperture, an unverified scale) is answered as
  its own gate answers: `unsupported`, with the gate's reason and message. So is a request without a profile that
  asks more of LensVisualizer than it takes at once (more than 101 fields or 501 frequencies, or a frequency above
  1000 cycles/mm, today): `unsupported`, with the gate's message, never an error.
- **The output** is `<runsDir>/mtf/<profile>/<run>/mtf.json`, with the case beside it under `cases/`: the request,
  the engines with their fingerprints, and each answer whole. `<run>` is the lens key, with `-zoom<t>` at a zoom
  position other than 0 and `-f8` for the comparison. Answers are kept in the result store as for a suite, so a
  second run computes nothing. The file holds no time, no path and nothing of the machine. `--json` prints it,
  with the fields of each answer as plain numbers.
- **Exit code**: 0 when every engine answered in every state, `unsupported` included; 1 when an engine ended in
  an error, when the lens has no case in a state that was asked about (the other end is asked all the same) or
  when LensVisualizer cannot be loaded; 2 for a command line that cannot be used.

Held by the integration tests: the answer for each of the 12 benchmark configurations equals LensVisualizer's own
`computeMtf` for the tab's request, spelled out a second time in the test, in every bit of every curve; the lens
the tab's worker rebuilds gives the same bits; without a profile the answer is `computeMtf` of the spec, the lines
and the stop of the case, in every bit, wide open, stopped down on three lines and at a finite conjugate; two
processes write the same bytes; and source canaries fail when the tab, the hook, the worker, the defaults or the
names and limits of a request are rewritten. The contract is in
[contract/CONTRACT.md](../contract/CONTRACT.md#mtfnative).

Measured at LensVisualizer `ed78cf40` (engine closure `1827eefe`) with `lvrtc mtf <key>`, every configuration on
the photopic spectrum, diffraction estimate, best axial focus. S and T are the sagittal and tangential MTF at 10
and 30 cycles/mm:

| Configuration | Focus shift, mm | Traced f/ | Axis: S10 T10 S30 T30 | 70 % field: S10 T10 S30 T30 | Grids |
|---|---:|---:|---|---|---|
| `canon-ef-135-f2l-usm` | −0.0280 | 2.06 (surface 8) | 0.9487 0.9487 0.7512 0.7512 | 0.9442 0.9440 0.6761 0.7111 | 32 to 64 |
| `fujifilm-fujinon-gf-63mm-f28-r-wr` | −0.0426 | 2.87 | 0.9699 0.9699 0.8813 0.8813 | 0.8351 0.8794 0.5916 0.6270 | 64 to 128 |
| `sigma-35mm-f14-dg-hsm-a` | −0.0256 | 1.49 (surface 14) | 0.9571 0.9571 0.7706 0.7706 | 0.7245 0.9059 0.4818 0.6297 | 32 to 128 |
| `nikkor-z50f12` | −0.0515 | 1.23 | 0.9753 0.9753 0.8494 0.8494 | 0.8501 0.9308 0.6273 0.7047 | 32 to 128 |
| `sony-fe-20mm-f18-g` | −0.0400 | 1.85 | 0.9615 0.9615 0.8173 0.8173 | 0.7398 0.3123 0.1115 0.0263 | 64 to 128 |
| `sony-fe-400mm-f28-gm-oss` | +0.0511 | 2.91 | 0.9773 0.9773 0.9223 0.9223 | 0.9739 0.9667 0.9018 0.8861 | 32 to 64 |
| `sigma-105mm-f28-dg-dn-macro-art` | −0.0215 | 2.90 | 0.9717 0.9717 0.8922 0.8922 | 0.9585 0.9247 0.7814 0.6011 | 32 to 64 |
| `nikon-z-24-70f4s`, wide | −0.0734 | 4.00 | 0.9662 0.9662 0.8775 0.8775 | 0.9644 0.9232 0.8733 0.6426 | 32 to 64 |
| `nikon-z-24-70f4s`, tele | +0.0181 | 4.00 | 0.9685 0.9685 0.9029 0.9029 | 0.8519 0.8881 0.5974 0.6896 | 32 to 128 |
| `nikon-z-mc-105f28` | +0.0294 | 2.89 | 0.9750 0.9750 0.9133 0.9133 | 0.9725 0.9400 0.8909 0.7350 | 32 to 64 |
| `nikon-z-135f18-plena` | −0.0109 | 1.85 | 0.9808 0.9808 0.9115 0.9115 | 0.9685 0.9704 0.8386 0.8765 | 32 to 128 |
| `sigma-45mm-f28-dg-dn-contemporary` | −0.0316 | 2.90 | 0.9370 0.9370 0.7722 0.7722 | 0.9521 0.9163 0.7656 0.6900 | 64 to 128 |

Every field of every configuration has curves; one, the full field of `sigma-35mm-f14-dg-hsm-a`, is
`unconverged` at the grid cap. The iris limits the axial beam everywhere but on the two lenses named. The focus
shift and the traced f-number of the eight configurations that LensVisualizer's own committed chart-regression
report holds are that report's, to its printed precision, although the report asks with a grid cap of 256, its
own fields and frequencies and radii that are not scaled: none of that enters the axial focus search or the
traced aperture. The figures are pinned in `test/integration/lv/mtf.test.ts` and compared while LensVisualizer's
engine files and the case of a configuration are the ones they were measured with.

## The MTF recipe, the replay and rung R4f

Stage 3.2. Before any other engine's MTF is set beside LensVisualizer's, three things have to be settled: what
exactly is being compared (the recipe), whether the comparator understands how LensVisualizer samples a field (the
replay), and how well its own estimator reproduces LensVisualizer's sum on the same rays (rung R4f).

**The recipe** is one object for a run: the plane, the fields with their chief-ray angles and target image
heights, the lines with their weights, the frequencies and the stop radius, each as LensVisualizer resolves it for
the case. It is the first step of LensVisualizer's own `computeMtfSteps`, which states the field axis, the angle of
every fraction and the focus before any field is traced. A case file has no LensVisualizer to ask: its run states
its fields as angles, or it has no recipe. The contract describes its members
([the MTF recipe](../contract/CONTRACT.md#the-mtf-recipe)); `lvrtc run` records it in the manifest:

```bash
node bin/lvrtc.mjs run suites/benchmark.json --rungs r4f
node bin/lvrtc.mjs compare benchmark
```

**The replay** (`src/engines/lv/replay.ts`) walks a field as LensVisualizer does: the launch and the footprint,
then grid after grid through `MTF_GRID_LADDER` (16, 32, 64, 128, 256, up to the cap of 128), each grid traced at
every line by LensVisualizer's own `traceMtfBundle`, the footprint widened and the grid traced again when rays
reach its guard band, and the walk ended by LensVisualizer's own `refineMtfField` when two grids agree within
0.01 below 50 cycles/mm. What LensVisualizer exports is called; what it does inline is restated line by line with
source canaries ([the engine `replay`](../contract/CONTRACT.md#the-engine-replay)). The one thing that is not
LensVisualizer's is the sum: the comparator's `polychromaticOtf` on the landings of the bundles. For each field the
replay keeps the grids it traced, the footprint it was left with, the bundles of the final grid (every ray with
its launch, its landing and its weight) and the reference point.

**Rung R4f** asks `lv` and `replay` the same `mtf.native` request and holds the two answers to each other
([the contract](../contract/CONTRACT.md#rung-r4f-the-fidelity-of-the-replay)): `mtf.maxAbs` within 1e-9, and not
one grid size, ray count or field status apart. It is the only rung whose two engines share their rays, so it says
nothing about LensVisualizer's tracer: it says that the comparator's estimator, handed LensVisualizer's rays, gives
LensVisualizer's MTF, and that the comparator knows which rays those are. Hermetically it runs on the fake LV tree,
one lens of which samples its MTF grid by grid with a ladder, a tolerance and plain sums of its own
(`test/engines/lv/replay.test.ts`, `test/cli/fidelityLadder.test.ts`); a fake lens whose "product MTF" is a closed
form and no sampling is a `FAIL` there, which is what the rung is for.

Measured at LensVisualizer `33ebdb30` (engine closure `78215d72`) on the benchmark suite: 96 runs, 480 fields, 51
frequencies, both cuts. Every pair is `PASS`; `sampling.mismatches` and `fields.mismatches` are 0 in every run;
every field has curves. The worst `mtf.maxAbs` of each configuration over its two sets of lines, and the grids its
five fields end at on the reference line:

| Configuration | Wide open, design | Wide open, best focus | f/8, design | f/8, best focus | Grids wide open, design (reference line) | Grids at f/8, design |
|---|---:|---:|---:|---:|---|---|
| `canon-ef-135-f2l-usm` | 5.0e-15 | 3.4e-15 | 4.6e-15 | 5.9e-15 | 32 32 32 64 64 | 32 32 32 32 64 |
| `fujifilm-fujinon-gf-63mm-f28-r-wr` | 8.9e-15 | 9.7e-15 | 5.0e-15 | 3.2e-15 | 64 64 128 128 128 | 32 32 64 32 32 |
| `sigma-35mm-f14-dg-hsm-a` | 1.1e-14 | 1.1e-14 | 5.6e-15 | 4.2e-15 | 32 64 128 128 128 | 32 32 32 64 32 |
| `nikkor-z50f12` | 8.5e-15 | 1.3e-14 | 4.8e-15 | 3.2e-15 | 128 128 128 128 128 | 32 32 32 32 32 |
| `sony-fe-20mm-f18-g` | 1.0e-14 | 7.8e-15 | 4.6e-15 | 4.8e-15 | 64 64 128 128 128 | 32 32 32 64 64 |
| `sony-fe-400mm-f28-gm-oss` | 5.0e-15 | 2.4e-15 | 4.0e-15 | 3.9e-15 | 32 64 64 64 64 | 32 32 32 32 64 |
| `sigma-105mm-f28-dg-dn-macro-art` | 5.1e-15 | 5.2e-15 | 4.1e-15 | 4.4e-15 | 32 64 32 32 64 | 32 32 32 32 64 |
| `nikon-z-24-70f4s`, wide | 1.0e-14 | 6.9e-15 | 4.2e-15 | 4.9e-15 | 64 128 64 64 128 | 32 32 32 64 32 |
| `nikon-z-24-70f4s`, tele | 7.5e-15 | 9.3e-15 | 6.0e-15 | 5.7e-15 | 32 64 64 128 128 | 32 32 32 32 64 |
| `nikon-z-mc-105f28` | 9.4e-15 | 4.6e-15 | 4.1e-15 | 4.0e-15 | 32 32 32 128 64 | 32 32 32 32 32 |
| `nikon-z-135f18-plena` | 8.4e-15 | 6.6e-15 | 3.0e-15 | 4.0e-15 | 64 64 64 64 128 | 32 32 32 32 32 |
| `sigma-45mm-f28-dg-dn-contemporary` | 5.2e-15 | 8.2e-15 | 3.0e-15 | 3.4e-15 | 64 64 64 64 128 | 32 32 32 32 32 |

The largest of all is 1.25e-14, on `nikkor-z50f12` at its best focus on the reference line (half field, sagittal,
6 cycles/mm); the photopic runs are all below 6.2e-15. It is rounding and nothing else: LensVisualizer adds the
terms of a field up plainly, in the order of its rays, and for its 51 evenly spaced frequencies rotates one phasor
from frequency to frequency, while the estimator reduces each phase on its own and compensates its sums. On up to
63 000 rays a field that is a few units in the last place a term, and no method. The gate of 1e-9 is 80 000 times
the largest figure. In six runs a footprint is widened once, in LensVisualizer and in the replay alike: the full
field of `sony-fe-400mm-f28-gm-oss` wide open (both sets of lines, at both planes), and three fields of
`sony-fe-20mm-f18-g` at f/8 on the photopic lines (at both planes). The feature suite and the smoke suite pass too (23 runs, worst
1.25e-14). `test/integration/lv/fidelity.test.ts` runs all of it and pins the grids of the 24 runs as the lenses
open.

R4f takes about three minutes on the benchmark: LensVisualizer's `computeMtf` and the replay each trace every grid
of every field once.

## Rung R4: the geometric MTF of the same rays

`lvrtc run <suite> --engines lv,ref,optiland --rungs r4` asks the `rays.trace` requests of R2 and R3 (with them in
one command an engine traces a set once for all three), and `lvrtc compare` applies the comparator's binless
geometric estimator to where each engine lands the rays of a field, and sets the curves of two engines against
each other: `mtf.maxAbs`, gated at 1e-7 with no floor. The metrics and their rules are in
[the contract](../contract/CONTRACT.md#raystrace); the comparator is `src/compare/raysMtf.ts`.

What was decided in Stage 3.3, and why:

| Question | Decision | Why |
|---|---|---|
| Which rays | The run's ray sets as they are: LensVisualizer's own launch lattice over the footprint it finds for a field, `sampling.bundleGrid` cells across (32 unless the run says otherwise), every cell a ray, at each line of the case. The fields are the run's (0, 0.5 and 1 of the image height in the committed suites). | They are a fixed grid, the same bytes whenever they are generated, and R2 and R3 judge the very same rays, so a difference in R4 is read off R2's figures for the same set. No request is added and no engine traces anything twice. The grid a field's refinement ends at in LensVisualizer differs from field to field (32 to 128 cells on the benchmark, over a footprint that may have been widened), is what R4f holds on LensVisualizer's own trace, and is up to sixteen times the rays a field for three engines to trace and the store to keep; `sampling.bundleGrid` asks for a finer lattice where one is wanted. |
| Which plane | The image plane of the run's case. | A run at LensVisualizer's best focus has a case exported at that plane (Stage 3.2), so every engine's own `imagePoint` is the landing on the recipe's plane, and it is the landing R2 judges. Nothing is projected a second time; a recipe of another plane than the case's is not compared. |
| Which frequencies | The recipe's: LensVisualizer's 51, 0 to 100 cycles/mm in steps of 2, for its lenses; 10, 30 and 50 for a case file whose run states none. | The recipe is recorded with the run (`runs[].recipe`), so the comparison reads them from the manifest. A run without a recipe is not asked. |
| One figure of several requests | A field's sets, one for each line, are one comparison ([a set that spans requests](../contract/CONTRACT.md#comparison)): `compareManifest` puts the groups of a rung together by `QuantityComparator.spanOf`, and hands the comparator each engine's answers to all of them. | The MTF of a spectrum is the modulus of a sum over the lines. `comparePair`, `compareGroup`, the floor rule, reports and baselines are untouched: a span is a set like any other, under the id of its first request. |
| "Valid in every engine" | Of the two engines of a pair: a ray is in both sums or in neither. | A pair's figures then depend on its own two answers, as its record in a baseline says (it names two fingerprints). Where the engines agree on which rays arrive, which R2 gates, it is the same set for every pair. |
| The reference point | Midway between the two engines' flux-weighted centroids of the first line's rays. | One point for both engines and every line, lost with no chief ray. The modulus does not depend on it. |

**Measured** (LensVisualizer `33ebdb30`, engine closure `78215d72`; optiland `4e893f53`), on the benchmark in its
four conditions: 96 runs, 288 fields (three a run), 611 140 rays that both engines of a pair land, 51 frequencies,
both cuts. Every pair is `PASS`; no ray is dropped in any pair.

| Pair | Largest `mtf.maxAbs` | Where | At 10 / 30 / 50 cycles/mm |
|---|---|---|---|
| `lv` – `ref` | 5.39e-8 | `sigma-45mm-f28-dg-dn-contemporary` at f/8, best focus, reference line: full field (25.6°), tangential, 98 cycles/mm | 8.0e-9 / 1.8e-8 / 4.0e-8 |
| `lv` – optiland | 5.39e-8 | the same | the same |
| optiland – `ref` | 1.20e-11 | `nikon-z-24-70f4s`, wide, best focus, reference line: full field (43.3°), sagittal, 68 cycles/mm | 4.3e-12 / 8.2e-12 / 1.0e-11 |

By condition the largest of `lv` against `ref` is 3.4e-8 wide open at the design plane, 3.0e-8 at best focus,
5.2e-8 at f/8 and 5.4e-8 at f/8 and best focus; on the photopic lines 2.9e-8 (`sony-fe-20mm-f18-g` at f/8, best
focus, full field). On the feature suite (18 runs, 54 fields, 104 846 rays) every pair passes too: `lv` – `ref`
4.8e-8 (the Hologon, `stop-inside-element-ref`, full field, tangential, 94 cycles/mm), optiland – `ref` 6.7e-12;
the smoke suite, `lv` – `ref` only, 2.2e-8.

**Whose the figure is.** The two exact tracers agree to 1e-11, so what `lv` differs by is LensVisualizer's own: it
meets a surface within 1e-9 mm of it. On the rays of the largest figure R2 has LensVisualizer's landings within
7.6e-10 mm of `ref`'s (optiland's within 4.2e-13 mm), and a landing that is δ off turns its term of the sum by
2πνδ, 4.7e-7 at 98 cycles/mm: the measured 5.4e-8 is a ninth of that, since the rays of a bundle are not off
alike. **The gate of R2 does not imply the gate of R4**: a landing may be 1e-8 mm off and pass R2, and at
100 cycles/mm that is a phase of 6e-6, sixty times this gate. R4 passes on what LensVisualizer's landings are
(the largest of the benchmark is 9.1e-9 mm, on another lens), not on what R2 allows; LensVisualizer stands at 54 %
of the gate, and the rung has no floor. See [docs/gotchas.md](gotchas.md).

R4 adds no tracing: on a warm store the benchmark's run takes 85 s with it and 55 s without (the recipe of each
run is LensVisualizer's focus search), and its comparison 48 s in place of 33 s.

## Rungs R6a and R6b: the wave MTF

`lvrtc run <suite> --engines lv,ref,optiland --rungs r6a` asks the `rays.trace` requests of R2 to R4 and, after
them, those of the same fields on a lattice of twice as many cells across; `lvrtc compare` applies the
comparator's wave estimator ([above](#the-wave-otf)) to each engine's trace of a field and sets the curves of two
engines against each other: `waveMtf.maxAbs`, gated at 4e-5 with no floor, wherever the lattice may carry the
figure. `lvrtc run <suite> --rungs r6b` sets LensVisualizer's own diffraction MTF beside the same estimator on
LensVisualizer's rays, and is recorded. The metrics and their rules are in
[the contract](../contract/CONTRACT.md#raystrace); the comparators are `src/compare/raysWaveMtf.ts` and
`src/compare/mtfWave.ts`, and the engine of R6b `src/engines/lv/waveEngine.ts`.

What was decided in Stage 3.5, and why:

| Question | Decision | Why |
|---|---|---|
| Which lattices | The run's own ray sets (`sampling.bundleGrid`, 32 cells across the beam) and the same fields at twice as many (64): the finer is judged, and the coarser says whether it has converged. The finer sets are made by the same case source with the sampling doubled (`fineSampling`), recorded under `runs[].fineRaySets`, and asked of R6a alone. | A convergence flag needs two lattices. The coarser costs nothing, since R2 to R4 have traced it; R2, R3 and R4 keep judging the sets they judged, and their baselines the figures they held. A lattice of 128 would be sixteen times the rays of the run's own for three engines to trace and the store to keep (48 GB for the benchmark), and 16 beside 32 leaves almost no field converged. |
| When a lattice is an arbiter | Neighbouring cells within a quarter wave in both estimates (`QUARTER_WAVE`), and neither estimate moved by more than 0.005 on the axis, 0.01 off it, from the coarser lattice (`CONVERGENCE_BANDS`, `waveFlags`). | The first is the estimator's own limit: beyond it the sum may alias. The second is the plan's band for an MTF held to another method's: the rim of a lattice is a staircase of first order in the cell, so what an estimate moves by on doubling is about what the finer one is still off by, and an estimate that moves by more than the band cannot say on which side of it another figure lies. |
| A field that is flagged | Its figure is written down as `waveMtf.flagged`, `waveMtf.maxAbs` is not measured, and the pair's reason says which fact flagged it. It passes, as whatever was not measured does, and is in no pin. | Two estimates of one undersampled lattice still compare two traces of the same rays, but the estimate is no arbiter of anything; nothing is widened to cover such a field. |
| Which frequencies | The recipe's, thinned to at most eleven evenly spaced ones (`waveFrequencies`): 0 to 100 cycles/mm in steps of 10. | A wave transfer function costs a search of the pupil for every cell and frequency: 51 frequencies would make the benchmark's comparison a quarter of an hour. |
| Rays, weights, plane, reference point | As R4: the rays both engines of a pair land, the request's weights, the case's plane, and the point midway between the two engines' flux-weighted centroids. | The step of the path from cell to cell includes the tilt of the reference: the point belongs amid the spot. |
| R6b's other side | An engine, `wave`: LensVisualizer's launch lattices for each field, traced by LensVisualizer as `lv` answers `rays.trace`, and the estimator on them. It answers `mtf.native` for the method `diffraction`, as `replay` answers the geometric one. | A rung compares two answers to one request. The rays are the ones R6a judges for `lv`, generated by the same function. |
| R6b's bands | `mtfOnAxis.maxAbs` 0.005, `mtfOffAxis.maxAbs` 0.01, over the fields both answers stand by; a field an answer calls unconverged is written down as `mtfFlagged.maxAbs`, in no band. | The plan's attention band. Each field has the class of its difference: method, numerical (a sampling that did not settle) or unsupported. |

**R6a, measured** (LensVisualizer `33ebdb30`, engine closure `78215d72`; optiland `4e893f53`), on the benchmark in
its four conditions: 96 runs, 288 fields, LensVisualizer's lattice at 64 cells across the beam (54 to 80 columns)
with the one at 32 beside it, eleven frequencies, both cuts. Every pair is `PASS`; no ray is dropped in any pair.
208 fields are judged and 80 flagged (25 undersampled, 17 not converged, 38 both), the same fields in each of the
three pairs.

| Condition | Fields judged | `lv` – `ref` | `lv` – optiland | optiland – `ref` |
|---|---|---|---|---|
| wide open, design plane, reference line | 18 of 36 | 2.74e-6 | 2.74e-6 | 7.80e-10 |
| wide open, design plane, photopic | 13 of 36 | 1.61e-6 | 1.62e-6 | 5.06e-10 |
| wide open, best focus, reference line | 21 of 36 | 2.84e-6 | 2.84e-6 | 1.15e-9 |
| wide open, best focus, photopic | 14 of 36 | 1.31e-6 | 1.31e-6 | 4.18e-10 |
| f/8, design plane, reference line | 35 of 36 | 3.12e-6 | 3.11e-6 | 1.05e-9 |
| f/8, design plane, photopic | 36 of 36 | 2.17e-6 | 2.17e-6 | 5.99e-10 |
| f/8, best focus, reference line | 35 of 36 | 3.11e-6 | 3.11e-6 | 9.65e-10 |
| f/8, best focus, photopic | 36 of 36 | 2.16e-6 | 2.16e-6 | 7.05e-10 |

The largest judged figure is 3.12e-6: `lv` against `ref` on `sony-fe-20mm-f18-g` at f/8, design plane, reference
line, full field (47.5°), tangential, 30 cycles/mm; `lv` against optiland is 3.11e-6 on the same field. The two
exact tracers are within 1.15e-9 (`nikon-z-24-70f4s` at its wide end and best focus, reference line, full field,
tangential, 50 cycles/mm). **The pin**: ten times 3.12e-6, rounded up to one digit, **4e-5**. It is a pin of
LensVisualizer's rounding, its 1e-9 mm at a surface carried into the path, and not of the two exact tracers,
which agree 2700 times closer. On the flagged fields the figures are of the same size (`lv` up to 1.84e-6,
optiland against `ref` up to 6.6e-10): they are left out because the lattice is no arbiter, not because they
would move the pin.

**Not covered.** Wide open, 66 of 144 fields are judged, and of two lenses none at the design plane:

| Lens, wide open | Judged at the design plane | at best focus |
|---|---|---|
| `nikkor-z50f12` | 0 of 6 | 1 of 6 |
| `sony-fe-20mm-f18-g` | 0 of 6 | 0 of 6 |
| `sigma-35mm-f14-dg-hsm-a` | 1 of 6 | 1 of 6 |
| the other nine configurations | 2 to 5 of 6 | 2 to 6 of 6 |

A fast lens wide open has a wavefront that turns by 0.5 to 1 wave from cell to cell of a 64-cell lattice (51 waves
on the photopic lines of one), and would need 128 to 256 cells; in that regime the transfer function is geometric
and R4 holds it. At f/8, 142 of 144 fields are judged (the two that are not, the full field of
`sigma-35mm-f14-dg-hsm-a` on the reference line at both planes, moved by 0.015 on doubling).

**What it costs.** The finer lattice is 3.5 million rays an engine on the benchmark, four times the run's own:
4 GB of the store for each engine. From an empty store `lvrtc run --rungs r6a` on three engines takes about
8 minutes and writes 15 GB; `lvrtc compare`, 3.6 minutes for the three pairs. For that reason R6a and R6b are in
no committed baseline (the MTF baselines are Stage 3.8), `npm run test:optiland` holds R6a on 17 of the 96 runs
(the three lenses of the largest figures and of the uncovered condition, 50 s), and the figures above are of a run
made once for the pin.

**R6b, measured** on the same benchmark (96 runs, three fields each, eleven frequencies; LensVisualizer's grid cap
at its default of 128, the estimator at 64 cells with 32 beside it): 91 pairs `RECORDED` and 5 `ATTENTION`, none
an error. 208 fields are compared in a band; 80 are flagged, all of them by the estimator (LensVisualizer calls
one field unconverged, which the estimator flags too); none is unavailable.

| Condition | Fields in a band | Largest on the axis (band 0.005) | Largest off the axis (band 0.01) | Largest flagged | `ATTENTION` |
|---|---|---|---|---|---|
| wide open, design plane, reference line | 18 of 36 | 7.54e-3 | 7.88e-3 | 1.26e-2 | 2 of 12 |
| wide open, design plane, photopic | 13 of 36 | 6.57e-3 | 5.47e-3 | 1.67e-2 | 3 of 12 |
| wide open, best focus, reference line | 21 of 36 | 4.83e-3 | 6.35e-3 | 1.36e-2 | 0 |
| wide open, best focus, photopic | 14 of 36 | 3.78e-3 | 5.86e-3 | 1.29e-2 | 0 |
| f/8, design plane, reference line | 35 of 36 | 4.85e-3 | 7.75e-3 | 3.07e-3 | 0 |
| f/8, design plane, photopic | 36 of 36 | 3.54e-3 | 5.96e-3 | none | 0 |
| f/8, best focus, reference line | 35 of 36 | 4.99e-3 | 7.37e-3 | 3.06e-3 | 0 |
| f/8, best focus, photopic | 36 of 36 | 4.22e-3 | 6.96e-3 | none | 0 |

The five `ATTENTION` rows are all on the axis, wide open at the design plane: `nikon-z-24-70f4s` at its tele end
(7.5e-3 on the reference line, 5.5e-3 photopic), `nikon-z-135f18-plena` (6.6e-3, photopic), `nikon-z-mc-105f28`
(5.8e-3, photopic) and `canon-ef-135-f2l-usm` (5.5e-3, reference line).

**The class of the difference.** Both answers stand by every field in a band, so its class is *method*; what the
two methods differ by is mostly their lattices. LensVisualizer ends a field's refinement at the first grid whose
change from the grid before is within its own tolerance, 0.01 up to 50 cycles/mm (its `maxDelta` is 1e-3 to 1e-2
where it stops; the band of R6b on the axis is half that tolerance): 32 cells for 119 of the 144 fields at f/8,
64 or 128 for the rest. Over the fields the estimator samples:

| At f/8, LensVisualizer's grid against the estimator's | Fields | Mean difference | Largest |
|---|---|---|---|
| the same (64 and 64) | 23 | 5.7e-4 | 2.5e-3 |
| 32 against 64 | 119 | 2.9e-3 | 7.75e-3 |
| the same, with the estimator at 32 (`sampling.bundleGrid: 16`) | 119 | 4.5e-4 | 5.9e-3 |

On one grid the sheared estimate and Hopkins' autocorrelation agree to about 5e-4 on average; with LensVisualizer
at 32 cells and the estimator at 64 they differ by six times that, which is what the estimator's own figure moves
by from 32 to 64 (its `maxDelta`, 1e-3 to 8e-3 at f/8). So a row of R6b near its band at f/8 says that
LensVisualizer stopped refining at 32 cells, not that its method errs; and since the estimator at 64 cells is
itself still within a band of its limit and no closer, neither side is the other's arbiter there. The rung is
recorded for that reason. On the benchmark it takes about 13 minutes, nearly all of it LensVisualizer tracing the
lattices of the photopic runs; `npm run test:lv` holds it on six runs of the reference line (7 s).

## optiland's own MTF

`optiland` answers `mtf.native` with optiland's FFT MTF, the class `ScalarFFTMTF`
(`workers/python/lvrtc_optiland/mtf.py`; the contract has the answer member by member under
[the engine `optiland`](../contract/CONTRACT.md#the-engine-optiland)). It is an independent method with a sampling
of its own: rung R5, which sets it beside LensVisualizer's MTF, is recorded and never gated, and comes with Stage
3.7. This is the engine side: what is asked of optiland, what is read back, and what a field becomes when optiland
cannot compute it.

A request states frequencies, fields as angles (the angles of the run's [recipe](#the-mtf-recipe-the-replay-and-rung-r4f)),
the method `diffraction` and the focus `design`: the plane is the image plane of the case, so LensVisualizer's best
axial focus is a case at that plane and optiland needs to know nothing of LensVisualizer.

| | |
|---|---|
| One call | one field, one sampling, one new optic: built and verified as for every quantity, then given the field and read back (`field_optic`, `verify_field`). A step never depends on what was asked before it: the 256 rays of the ladder 128, 256 are the 256 of the ladder 256, 512, bit for bit |
| Field | optiland's `angle` field at the angle asked, alone in the optic, no vignetting factor. optiland's frame is the contract's mirrored in y; the chief ray's launch direction is held to (0, sin, cos) |
| Pupil | optiland's own grid on the stop surface (`ray_tracer.set_aiming("robust", max_iter=50, tol=1e-10)`), out to the stop's clip radius, clipped by every surface's aperture |
| Reference sphere | optiland's `chief_ray` strategy, `remove_tilt=False`: centred on the chief ray's landing, which is `imageHeightMm`, with the distance to the paraxial exit pupil for its radius |
| Ladder | `num_rays` 128 then 256, `grid_size = 2 * num_rays` stated; with the engine option `fftRays: 512`, 256 then 512. The curves are the finer step's; a move above 0.005 on the axis, 0.01 off it, is `unconverged` |
| Frequencies | linear interpolation on optiland's own axis of each cut (`freq_tang`, `freq_sag`, cycles/mm), never beyond its last sample |
| Lines | one: the case's only line, or the engine option `line`. A case of several lines without it is `unsupported` (`lines.polychromatic`): optiland gives a modulus per wavelength, and no polychromatic MTF is formed of moduli |
| A field optiland cannot compute | a row: `unavailable` with `optiland-raised-<class>`, `no-frequency-axis`, `frequency-beyond-axis` or `mtf-not-a-modulus`; its curves are NaN, and where its chief ray landed is still said |

An engine option is no part of a request's identity and is part of the result store's key
(`storeKey`), so the answer at 512 rays is kept beside the answer at 256 and never found in its place.

**What it costs**, measured through the worker on this machine (optiland `4e893f53`, JIT on): a field of the
Double-Gauss takes 0.2 to 0.3 s at 128 and 256 rays and 0.6 to 0.7 s at 256 and 512; of the Nikkor Z 50 mm f/1.2
(35 surfaces) 0.7 to 0.9 s and 2.0 to 2.2 s; of the Sony FE 20 mm f/1.8 (27 surfaces) 0.8 to 1.1 s and 2.2 to
2.9 s. A field optiland fails on costs more, while its aimer tries every fallback: 6.7 s at 128 rays and 14 s at
256 on the Z 50 at 23°, where the ladder ends, and 45 s for one step of 512 rays asked by itself. The caches change
nothing of a field: on an empty cache directory the worker's start takes 17 s where it takes 3 s, and the first
MTF 1.0 s where it takes 0.33 s. The worker holds 0.9 GiB at 256 rays and 1.5 to 2.9 GiB at 512: optiland keeps
every ray at every surface. All of it is far inside the adapter's wait for a run, ten minutes, which the engine
keeps (`OPTILAND_TIMEOUTS`); a request that has nevertheless taken five minutes when its next field is to be
begun is answered as the error `time-budget`, which the result store does not keep, so that the worker is not
killed with the rest of a run still to answer. Each MTF is one line of the worker's log:

```
lvrtc_optiland: mtf.native fields=3 ok=3 unconverged=0 unavailable=0 surfaces=11 rays=128,256 field_ms=215,292,299 request_ms=833 peak_mib=889.2 pid=92708
```

**The Double-Gauss fixture**, optiland's own sample at f/5 on its one line, on the plane of the case:

| Field | Image height | 10 cycles/mm T, S | 30 T, S | 50 T, S | Moved 128 to 256 | Status |
|---|---|---|---|---|---|---|
| 0° | 0 | 0.8962, 0.8962 | 0.5603, 0.5603 | 0.3290, 0.3290 | 0.0014 | `ok` |
| 10° | 17.546 mm | 0.7223, 0.4663 | 0.0453, 0.0062 | 0.0071, 0.0041 | 0.0025 | `ok` |
| 14° | 24.671 mm | 0.4232, 0.0647 | 0.0130, 0.0047 | 0.0038, 0.0114 | 0.0077 | `ok` |
| 40° | none | none | none | none | | `unavailable`, `optiland-raised-ValueError` |

At 512 rays the axis reads 0.8962, 0.5599, 0.3288 and has moved by 0.0004. The traced f-number is 4.9808, of the
stop's clip radius of 6.35 mm (the stop radius of the case, 6.3412 mm, is the paraxial pupils', at f/4.99). The
tests of the worker (`test_mtf.py`) hold these to what they derive: the lag of one ray and the f-number to the
marginal ray traced in 60 digits (to 1e-7 of the cut-off), the tangential lag at 10° to the two rim rays of the
meridian, each chief ray's landing to the ray through the centre of the stop (to 1e-8 mm), every value on the axis
to the diffraction limit of the sampled pupil, counted cell by cell, and the two cuts on the axis to each other.

On lenses of LensVisualizer wide open, as the plan expected: the Z 50 mm f/1.2 is `unconverged` on the axis between
128 and 256 rays (0.017) and between 256 and 512 (0.008), and has no row at 18° and 23°; the 20 mm f/1.8 is `ok`
on the axis and at 28° and `unconverged` at 47°, where a stopped rim ray leaves the lens and optiland's tangential
axis with it ([docs/gotchas.md](gotchas.md#optiland-calibrates-its-frequency-axes-with-four-rim-rays-whatever-became-of-them)).

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
  of each metric, whether a failure of the rung blocks the rungs after it, and whose numerical floor may exceed a
  tolerance, within which limits. A gated metric has a tolerance, and an independent-method rung is never gated.
- **What a comparator reads** beside the two answers: the spec of the request, from the store, and the case of the
  run, from the run directory's `cases/`. Without one it needs, its pairs are `ERROR`, with the reason.
- **Verdicts.** `UNSUPPORTED` when either engine cannot answer; `ERROR` when either gave no result or the two
  cannot be compared; `BLOCKED` when both answered and an earlier rung that blocks later ones failed for the same
  two engines on the same case; on a gated rung `PASS`, `FLOOR` or `FAIL`, where a metric that is not a number
  fails; on a recorded rung `RECORDED`, or `ATTENTION` outside the band. Only `FAIL` and `ERROR` are failures: a
  floor is a pass, and a blocked pair is not a second failure.
- **Exit code**: 0 when no pair is `FAIL` or `ERROR`; 1 otherwise; 2 when nothing was compared because the run has
  no manifest or the reference is not an engine of the run.

`lvrtc report <suite name | run directory> [--root <dir>] [--floor <dir>]` writes `report.json` and `report.md`
into the run directory from the manifest, the comparisons and the policy: the inputs (suite, contract version,
policy version, engines with fingerprints and, for the built-in ones, adapter revisions), the verdict counts, a
support matrix of rung by engine, and for each run and rung a reference-vs-each table, a pairwise matrix and the
values the answers only record, side by side, with a note on how to read the verdicts. A metric that is shown
and not judged stands beside the judged one of the same subject: the plain `pupilRadius.maxAbs` next to
`pupilRadius.maxScaled`, `sag.maxAbs` next to `sag.maxScaled`. A metric's cell says where its value occurs: the
field and surface of a mismatch, the quantity and line of the largest first-order difference, the line, field, ray
and surface of the largest distance between two hits. It exits 0 when the report is written, whatever the
verdicts are, and 2 when the run has no comparisons or they were made from another manifest or policy. Both
files, like `comparisons.json`, hold no time, no path and nothing of the machine, so the same run gives the same
bytes anywhere. With `--floor <dir>` it also writes the numerical-floor digest of the run into that directory,
`lv-floor.json` and `lv-floor.md`: the pairs of the engine the policy gives a floor and its arbiter, rung by rung
and run by run; it is for reading, and what is committed of a suite is its [baseline](#baselines). The digest lists the metrics in the order the comparator reports them, so there too a plain
figure follows its scaled one.

The expected reports of the fixture suites are in `test/fixtures/golden`; `node test/report/writeGolden.ts`
rewrites them after a change that is meant to change a report.

## Contract

Everything that crosses a boundary (an optical case, a run specification, a request to an engine, its result) is
a document of the engine-neutral contract in [contract/](../contract/CONTRACT.md): JSON Schema files as the source of
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
gives the same id, whole. The built-in engines (`src/engines/builtin.ts`: `lv`, `optiland`, `ref`) need no
definition; one that is given under a built-in engine's id is the engine of that id. An engine that cannot be built
or reached is found unavailable, with a code that says why: `not-configured`, `load-failed`, `spawn-failed`,
`hello-failed`, `contract-mismatch` and so on.

## The engine `optiland`

`optiland` is [optiland](https://github.com/optiland/optiland) behind a Python worker of the comparator,
`workers/python/lvrtc_optiland`. It is a built-in engine: name it (`--engines optiland`, a suite's `engines`)
wherever `engines.optiland.python` names an interpreter that can import optiland, and nothing else is configured.
The comparator supplies the rest (`src/engines/optiland/definition.ts`): the command
`<python> -m lvrtc_optiland`, `PYTHONPATH` set to `workers/python` of this repository, so that nothing is installed,
and where the worker's caches go.

**It answers `system.describe`, `paraxial.first-order` and `rays.trace`, which are rungs R0 to R3**: R2 and R3 ask
the same traces, and judge where the rays went and how long their paths are. It answers `mtf.native` with
[optiland's own FFT MTF](#optilands-own-mtf). Any other quantity is answered `unsupported`. What the four rungs find on three engines is under
[Phase 2](#phase-2-r0-to-r3-on-three-engines).

```bash
node bin/lvrtc.mjs run suites/benchmark.json --engines lv,ref,optiland --rungs r0,r1,r2,r3
```

Builds every case of the suite in optiland and asks all three engines for the system they built, for its
first-order data and for the trace of the same rays; `lvrtc compare benchmark` then judges each pair of engines.

**The builder** (`workers/python/lvrtc_optiland/build.py`) makes one optiland `Optic` for each spectral line of a
case, because optiland's constant-index material is the same at every wavelength and its first-order data is that
of its primary wavelength. It uses only what optiland has not deprecated; a deprecated call is an error.

| Of the case | Becomes, in optiland |
|---|---|
| the object | the object surface at `z = -inf`, or at the object plane of a finite object |
| a surface's vertex | `z=` the case's `z`, as it is: nothing is added up from thicknesses |
| `plane` | a `standard` surface of infinite radius, which optiland makes a `Plane` |
| `conic` | a `standard` surface with the radius and the conic constant |
| `asphere` | `even_asphere` when every power it states is even, else `odd_asphere`, with the coefficient list laid out to the highest power and 0 where the case has no term; `radius=inf` on a flat base; `tol=1e-12`, `max_iter=100` |
| the index after a surface, at the line | `IdealMaterial(n=...)` |
| `aperture.semiDiameter`, `innerSemiDiameter` | `RadialAperture(r_max=..., r_min=...)` on every surface, the stop like any other |
| `aperture.nominalSemiDiameter` | the surface's `semi_aperture`, which clips nothing: the heights of the sag are fractions of it |
| `stopIndex`, `conditions.stopSemiDiameter` | `is_stop=True`, and `set_aperture("float_by_stop_size", 2 x radius)` |
| `conditions.imageZ` | the image surface at that `z`, flat, without an aperture |
| the index after the last surface, at the line | the medium the image surface states: optiland takes the image space from there |
| the line | the optic's only wavelength, in µm, and primary |

**Nothing is answered about an optic that is not the case.** After building, the worker reads every one of those
values back from optiland's own objects and holds it to the case (`verify_optic`): the vertex in the geometry's
frame and on optiland's paraxial axis, the class of the geometry, its radius, conic constant and terms, the Newton
settings of an asphere, the class of the aperture and its two radii, the semi-aperture, the stop flag, that the
surface refracts by optiland's ordinary model (a plane that optiland was given as a thin lens is a `Plane` too, and
gave a system of the every-feature case a focal length of 19 mm for 27 mm), without a coating, the index, the
object and image planes, the index of the image space, the stop diameter and the wavelength. Then it holds the sag
optiland evaluates, at
four heights of each surface, to the contract's sag of the case's surface within 1e-9 on the scale of the sag's
rounding: the one check that does not depend on how a coefficient list is laid out. What differs is a result of
status `error` with the code `build-mismatch`, which names the surface, the field and both values:

```
surface 3 (4): tol is 1e-06 in the optic optiland built and 1e-12 in the case (line 0, 587.5618 nm)
```

So a keyword optiland's factory dropped, a coefficient list one place off and a diameter taken for a radius are
found before a ray is traced, each by a test that makes the mistake on purpose
(`workers/python/tests/optiland/test_build.py`). Why each keyword is what it is, is in
[docs/gotchas.md](gotchas.md#optiland).

**`system.describe` is written from the optics alone**: the function that writes it is not given the case.
`curvature` is one division, 1 over the radius optiland holds, which is 0 for its infinite one; `conic` is the
geometry's `k`, and 0 for a plane, which has none; `terms` are the coefficients read by optiland's own rule;
`clipRadius` and `innerClipRadius` are the aperture's two radii; `stopSemiDiameter` is the stop diameter halved;
the index table has a row from each line's optic; and `sag` is `geometry.sag` at the fractions of the
semi-aperture, with -0 written as 0 and no sag as a NaN.

**Features.** The engine declares every feature flag of the contract and no limit: an annular aperture, several
lines, a finite object, even and odd aspheres, a flat base and a conic constant. Each has a test on the real
optiland.

**`paraxial.first-order` is optiland's own first-order data** (`workers/python/lvrtc_optiland/first_order.py`):
every number is what `optic.paraxial` of a line's optic gives, and the worker changes only what it is measured
from. optiland states its object-space points from its first surface and its image-space points from the image
surface, so the worker adds the first vertex or the image plane, both read from the optic.

| Of the answer | Is, in optiland |
|---|---|
| `efl` | `f2()` |
| `frontFocalZ`, `frontPrincipalZ`, `entrancePupilZ` | `F1()`, `P1()`, `EPL()`, each plus the first vertex |
| `rearFocalZ`, `rearPrincipalZ`, `exitPupilZ` | `F2()`, `P2()`, `XPL()`, each plus the image plane, wherever the case put it |
| `backFocus` | that rear focal point minus the vertex of the case's `lastLensSurfaceIndex`: optiland reports its back focal point from the image surface and knows no rear plate |
| `entrancePupilSemiDiameter`, `exitPupilSemiDiameter` | half of `EPD()` and of `XPD()`, without the sign, which is negative where the stop is imaged upside down |
| `recorded.optilandFNumber` | `FNO()`: `f2() / EPD()`, never judged |
| `recorded.magnification`, for a finite object | `magnification()`, never judged |

- **The pupils are images of the stop radius of the case.** `EPD()` divides the stop diameter of the system's
  aperture, which the builder set to twice `conditions.stopSemiDiameter`; optiland's ray aiming takes the stop's
  radius from the stop surface's own aperture, the clip limit, which the first-order data never reads.
- **The image space is the image surface's.** optiland takes the index of the image space from the image surface
  and refracts its paraxial rays there, so the builder gives that surface the medium after the last surface of the
  case and `verify_optic` holds it there. Left in air, a surface into glass of index 1.5 had a focal length of
  100 mm for 150 mm.
- **What optiland has no answer for is `unsupported`**, each with an item of code `feature`: a term of power 1
  (`surface.asphere.linear-term`, as in every engine) and a term of power 2 (`surface.asphere.quadratic-term`),
  both decided from the case before anything is built; an afocal system (`system.afocal`: `f2()` is an infinity,
  or stands for a power of at most 1e-12 of the surfaces' own, since optiland has no test of its own); and an
  entrance pupil at infinity (`system.telecentric.object-space`: optiland's `XPD()` is a NaN there). An exit pupil
  at infinity is answered, with the infinities optiland's own division gives. No lens of LensVisualizer is any of
  these.
- **Nothing is written back into the optic.** The worker calls no `update_paraxial`, which would overwrite every
  semi-aperture; an optic passes the verification again after its first-order data was read. The data of one line
  takes some fifteen of optiland's paraxial traces: 8 ms for a lens of 11 surfaces.

Rung R0, measured at optiland `4e893f53` and LensVisualizer `b7deb221` (engine closure `46b028bc`), with the
command above on rung `r0` and `lvrtc compare`, and again at `1bf669ee` (closure `66027121`) with every figure the
same:

| Suite | R0, pairs | optiland against `ref`: largest sag difference | optiland against `lv` |
|---|---|---|---|
| `benchmark`, 24 runs | 120 `PASS` (72 pairs of two engines) | 4.5e-16 scaled, `sony-fe-20mm-f18-g-ref` surface 0; 1.8e-15 mm, `canon-ef-135-f2l-usm-ref` surface 8 | 3.9e-16 scaled, `nikon-z-24-70f4s-wide-ref` surface 10; 3.6e-15 mm, `sony-fe-400mm-f28-gm-oss-ref` surface 13 |
| `features`, 18 runs | 90 `PASS` (54 pairs of two engines) | 3.3e-16 scaled, `asphere-a20-ref` surface 5; 4.4e-15 mm, `stop-inside-element-ref` surface 6 | 2.3e-16 scaled, `fixed-iris-zoom-ref-wide` surface 3; 4.4e-15 mm, `stop-inside-element-ref` surface 6 |
| the contract's three cases, against `ref` | 6 `PASS` (3 pairs of two engines) | 2.9e-16 scaled, `double-gauss` surface 10; 8.9e-16 mm, `double-gauss` surface 0 | no case of LensVisualizer |

Not one vertex, curvature, conic constant, term, clip radius, inner clip radius, sag radius or index differs in
any pair, and optiland declares nothing unsupported. Over the whole catalog, outside the tests (2267 cases: every
prime, every zoom at both ends, the reference line and the photopic lines; 53 378 surfaces, up to 63 in a lens
and powers up to 20), every case passes R0 against `ref`: the largest sag difference is 6.0e-16 scaled
(`tamron-35-150mm-f2-28-di-iii-vxd-a058`, wide end, surface 28) and 1.3e-10 mm in plain terms, on the surface of
`russar-22-70f8` that ends just short of a hemisphere. A case takes optiland 12 ms: building its optics, reading
them back and describing them.

Rung R1, measured at optiland `4e893f53` and LensVisualizer `5278694b` (engine closure `78215d72`, 151 files),
with the command above and `lvrtc compare`. Each figure is the largest of its kind, in mm; the position and the
radius of a pupil are given plain and, where it differs, on the scale of the pupil's distance, which is what R1
judges:

| Suite | R1, pairs | optiland against `ref` | optiland against `lv` |
|---|---|---|---|
| `benchmark`, 24 runs | 120 `PASS` (72 pairs of two engines) | 1.8e-12, the front focal point of `sony-fe-400mm-f28-gm-oss-photopic` at 555 nm; of a pupil's position 1.0e-12, of its radius 5.7e-14 | 1.8e-12, the same point at 470 nm; of a pupil's position 8.0e-13, of its radius 5.7e-14 |
| `features`, 18 runs | 90 `PASS` (54 pairs of two engines) | 5.0e-14, the front principal point of `odd-asphere-photopic`; of a pupil's position 9.9e-14, of its radius 9.8e-15 | 6.0e-14, the front focal point of `odd-asphere-photopic`; of a pupil's position 1.1e-13, of its radius 1.1e-14 |
| the contract's three cases and 16 systems made for the rung, against `ref` | 38 `PASS` (19 pairs of two engines) | 5.3e-14, the front focal point of `double-gauss`; of a pupil's position 2.8e-14, of its radius 1.8e-15 | no case of LensVisualizer |

On the suites the largest scaled figure of a pupil is its plain one: no pupil that sets it lies a metre from its
image plane. At the 22 focus stations LensVisualizer certifies (14 lenses, from 1:40 to 1:1) all three engines pass
R0 and R1 pair by pair: the pairs of optiland are within 3.4e-13 mm in the cardinal points, 1.9e-13 mm in a
pupil's position and 4.7e-14 mm in its radius, and the three engines record one magnification to 1e-12 of itself.
Over the whole catalog on the reference line, in a test (900 lenses, 297 of them zooms: 1173 cases, each prime
that exports once and each zoom at both ends), optiland builds every case, has first-order data of every one, and
passes R0 and R1 against `ref` on every one: the largest difference of a value that is no pupil's is 4.7e-11 mm
(the front focal point of `sony-fe-400-800-f63-8-g-oss` at its tele end); of a pupil's position 1.0e-9 mm, which
is 1.4e-10 on the scale of its distance, and of a pupil's radius 4.6e-10 mm, 6.0e-11 on that scale, both the exit
pupil of `viltrox-af-75mm-f12-pro`, which lies 7.7 m away ([docs/gotchas.md](gotchas.md#any-two-engines)).

What optiland's own values say of LensVisualizer's stored constants is information, never judged: on the 12
benchmark configurations optiland's paraxial pupils lie up to 2.5e-5 mm (entrance) and 8.2e-6 mm (exit) from the
stored positions, its entrance pupil is up to 5.1 % wider than the nominal one (`nikon-z-135f18-plena`: 37.58 mm
against 35.76 mm), its exit pupil up to 3.2 % wider than the stored one, and its paraxial f-number is up to 4.9 %
below the nominal one (1.76 against 1.85 on that lens): the figures `lv`'s own paraxial kernel gave
([docs/gotchas.md](gotchas.md#the-stored-pupil-constants-are-not-paraxial)).

**`rays.trace` is optiland's own trace of the rays it is given** (`workers/python/lvrtc_optiland/trace.py`). The
origins and directions of a request go into optiland's `RealRays` as the float64 they are, with the wavelength of
the request's line, and `optic.surfaces.trace` carries them through that line's optic, the only one built for the
request. optiland records every ray on every surface, and the answer is those rows:

| Of the answer | Is, in optiland |
|---|---|
| `hits` | the point each surface recorded |
| `exitPoint`, `exitDirection` | the point and the direction the last surface of the case recorded |
| `opticalPath` | optiland's own sum on that surface, each stretch of it a length (below) |
| `imagePoint`, `opticalPathToImage` | the point optiland's image surface recorded and its sum there: optiland lands a ray itself, by the arithmetic of the comparator's own projection, and charges the way to the plane to the medium after the last surface of the case |
| `status`, `endSurface` | the worker's, from the rows, below |

- **Handed over bit for bit.** Nothing is normalised, mirrored, sorted or left out. The first row optiland
  records is the rays as it took them, and the worker holds it to the rays it was given, to the bit, before it
  reads another. A spec whose directions are not unit vectors within 1e-12 is `bad-spec`: optiland takes a
  direction for a unit vector and would trace it as it is.
- **optiland says of a ray only its intensity.** It carries every ray to the image whatever became of it: one that
  an aperture stopped keeps its coordinates and has an intensity of 0, one that missed a surface or was totally
  reflected is NaN from there. A ray is *ok* by optiland's own measure: an intensity above 0 and a number for its
  point, its direction and its path on every surface, and for its point and its path on the image. It ended at the
  first surface where that is not so.
- **Why a ray ended is said on evidence, or not said.** optiland does not tell a ray that an aperture stopped
  from one its iteration lost: both have an intensity of 0. The worker calls a ray *blocked* when what optiland
  returned shows why: a point that lies on optiland's own sag of the surface, within 1e-6 mm, with an intensity of
  0 (an aperture); such a point with no direction behind it, where optiland's radicand of Snell's law is negative
  (a total reflection); no point on a conic whose quadratic with the line has no root (a miss). Anything else is
  *failed*: no point on an asphere, or a point that is not on the surface. A ray that no longer travels toward +z
  is blocked at the next surface, and one that cannot reach the image plane is blocked behind the last, as the
  contract rules for every engine.
- **A ray optiland keeps is answered as optiland has it**, whether or not its point lies on the surface. Where
  optiland carries a ray through the far side of a hemisphere, or on from a point its iteration did not bring
  home, that ray is in the answer, and R2 finds it. The worker hides no ray and repairs none.
- **The optical path is optiland's own sum, with each step a length.** Read in optiland's source, its `opd` is
  the contract's path rule by rule: 0 at the ray's own origin, the index of the medium the ray is in times each
  step (air in front of the first surface; the medium after the last surface on the way to the image plane,
  whatever the image surface itself states), a step backwards subtracted, nothing added by a refraction. One
  thing differs: a step is the parameter of the line along the direction optiland holds, which is a length only
  for a unit vector, and optiland never makes a direction one. A spec may state a direction within 1e-12 of a
  unit vector, and optiland's own drift to 7.8e-15 from one behind the surfaces of a benchmark lens. So the worker
  takes each stretch optiland added times the length of the direction it was travelled along
  (`trace.path_lengths`), and says so in the method's `params`. That moves the paths of the benchmark by up to
  1.9e-9 waves, toward the contract's: on a ray whose hits optiland has right to 5e-14 mm, its own sum is 7.4e-10
  waves from the 60-digit path and the answer 4.3e-11. `verify_optic` reads the index optiland has in front of
  every surface, since a path is charged to a link between surfaces. A rear plate is a surface like any other,
  and an image space that is not air is charged at its own index; both have tests
  ([docs/gotchas.md](gotchas.md#optilands-optical-path-is-a-sum-of-steps-and-a-step-is-a-length-only-along-a-unit-vector)).
  The path is that of the ray optiland traced. Its refraction takes a direction for a unit vector too, and bends
  one that is given 4.5e-13 longer as if it leaned that much more: 1.0e-11 mm in a hit and 8.6e-9 waves behind
  100 mm of glass met at 30°. The worker bends no ray, so that is in the answer; no ray set has such a direction
  ([docs/gotchas.md](gotchas.md#optiland-refracts-a-direction-as-a-unit-vector-and-bends-one-that-is-longer-as-if-it-leaned-more)).
- **One batch a request.** A set goes to optiland whole, and a request of more than 16 384 rays in batches of that
  size, in the order given; the answer does not show the seam. A request of 20 000 rays through the 11 surfaces of
  the Double-Gauss is answered in 0.17 s, the worker's first trace among it. What optiland answers of a ray is not
  always that ray's alone: the tolerance of its iteration on an asphere is the batch's, and on an asphere of a
  flat base one totally reflected ray of the batch leaves every ray on the base plane
  ([docs/gotchas.md](gotchas.md#the-tolerance-of-an-aspheres-iteration-is-that-of-the-batch-it-is-traced-in)).

Rung R2, measured at optiland `4e893f53` and LensVisualizer `14da71d9` (engine closure `78215d72`, 151 files),
with the command above on rung `r2` and `lvrtc compare`. Each figure is the largest of its kind over the rays
that are ok in both engines, with where it occurs:

| Suite | R2, pairs of two engines | optiland against `ref` | `lv` against optiland | `lv` against `ref` |
|---|---|---|---|---|
| `benchmark`, 216 ray sets, 137 596 rays ok in every engine | 648 `PASS` | hit 1.2e-12 mm, `nikon-z-24-70f4s` wide at 650 nm, 24.2°; direction 2.1e-14 and landing 8.9e-13 mm, `sony-fe-20mm-f18-g` at 47.5° | hit 6.8e-9 mm, direction 3.1e-10, landing 9.1e-9 mm: `sigma-35mm-f14-dg-hsm-a` at 650 nm, 31.9° | the same ray, the same figures |
| `features`, 162 ray sets, 104 846 rays ok in every engine | 482 `PASS`, 4 `FLOOR` | hit 1.1e-12 mm and landing 5.9e-13 mm, `rear-plate-rim`; direction 1.3e-14, `fixed-iris-zoom` wide | hit 2.3e-9 mm, `e-line`; direction 2.1e-10 and landing 1.10e-8 mm, `stop-inside-element` at 470 nm, 55.3° | the same rays, the same figures |
| the contract's three cases and nine systems made for the rung, 42 ray sets, against `ref` | 42 `PASS` | hit 1.0e-12 mm, direction 4.1e-15, landing 5.1e-13 mm | no case of LensVisualizer | |
| the 24 focus stations LensVisualizer certifies, on the reference line: 72 ray sets that diverge from object points 40 mm to 2.3 m away and start on LensVisualizer's launch plane, 18 mm to 75 mm in front of the lens; 50 365 rays ok in every engine | 214 `PASS`, 2 `FLOOR` | hit 4.5e-12 mm, direction 6.8e-14, landing 4.6e-12 mm: `fujifilm-gf80-f17` at its closest focus, 18.3° | hit 1.12e-8 mm, direction 1.4e-10, landing 1.14e-8 mm: the same station and field | the same ray, the same figures |

Not one ray of either suite is stopped by one engine and passed by another, in the rim band or outside it, and no
engine fails a ray: each of the three lands 242 442 of the 421 334 rays and stops 178 892, every one at the same
surface. Nor is one at a focus station, where each lands 50 365 rays and stops 49 639; the stations were traced at
LensVisualizer `f3b4a337`, which has the same engine files and six lens models more. The four floors of the feature
suite are the Hologon's (`stop-inside-element`) at its full field at 470 nm and 510 nm, against `ref` and against
optiland alike; with optiland in the comparison the reason names both figures of the floor rule, what the witness
is off the arbiter by and what LensVisualizer is:

```
landing.maxDistance 1.10e-8 exceeds its tolerance 1.00e-8 at field 5.53e1, line 1, ray 264; floor of lv:
optiland against ref direction.maxAbs 2.78e-15 within 1.00e-12, optiland against ref hits.maxDistance 7.36e-14
within 1.00e-10, optiland against ref landing.maxDistance 2.20e-13 within 1.00e-10, lv against ref
direction.maxAbs 2.07e-10 within 1.00e-8, lv against ref hits.maxDistance 2.24e-9 within 1.00e-7, lv against ref
landing.maxDistance 1.10e-8 within 1.00e-7
```

Traced in 60-digit arithmetic, the worst rays of those rows put `ref` within 1.2e-13 mm and 2.9e-15 of the truth,
optiland within 1.2e-12 mm and 2.0e-14, and the rest on LensVisualizer. So in the suites optiland agrees with
the arbiter a hundred times more closely than the floor rule asks of a witness (1e-10 mm, 1e-12).

**Outside the suites it does not always**, and a comparison of the catalog must expect it. Measured on nineteen
lenses that the entries of [docs/gotchas.md](gotchas.md#optiland) name (460 ray sets, 561 506 rays), outside
the tests:

| What | Where | What it does to R2 |
|---|---|---|
| optiland has no hit on an asphere whose base conic the line misses | two phone lenses: 6346 rays, 6002 of them rays that `ref` and LensVisualizer land | those rays are `failed` and in no count; the pairs pass on the rest |
| optiland's iteration settles on a crossing beyond the rim, or on none | five lenses with strong aspheres: 162 rays stopped a surface early, 60 carried on from a point that is not on the surface, 1374 `failed` | mask mismatches: the pairs of optiland fail on 27 ray sets |
| optiland passes a ray on the far side of a hemisphere | `russar-22-70f8`: 942 rays, and 874 more rays landed than by `ref` | mask mismatches: the pairs of optiland fail on 6 ray sets |
| optiland's sums on an asphere are not compensated | `fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr` wide: 8.6e-10 mm and 3.2e-11 from `ref`; three more lenses above 1e-12 or 1e-10 mm | the pairs of optiland pass; 14 pairs of `lv` that are `FLOOR` beside `ref` alone are `FAIL`, optiland being no witness there |
| a surface behind the one before it | the eight lenses where LensVisualizer loses rays | none: optiland steps backwards as `ref` does, and LensVisualizer's pairs fail against both |

Two more were found on synthetic systems, 280 of them made at random and traced with probe lattices by `ref` and
optiland, in no test and on no lens of the catalog:

| What | Where | What it does to R2 |
|---|---|---|
| a steep ray, or a conic that reaches far, behind a surface that crosses the one before it | 776 rays of 4 of 160 systems made with gaps thinner than a sag | optiland steps backwards only where no crossing lies in front of the ray: it meets these in front, beyond the rim, and stops them where `ref` passes 510: mask mismatches |
| a totally reflected ray in the batch, in front of an asphere of a flat base | 42 ray sets of 11 of the 98 systems that have such a surface | every ray of the batch is left on the base plane, 2e-4 mm to 0.17 mm from the surface, and carried on: the pairs of optiland fail on a hit. The catalog's two lenses with such a surface are untouched with LensVisualizer's rays (168 ray sets) |

Each is a finding about optiland, attributed ray by ray in 60 digits where it is a matter of precision, and none
is in a suite. No gate and no limit was changed for any of them.

Rung R3, measured at optiland `4e893f53` and LensVisualizer `c05a2ab7` (engine closure `78215d72`, 151 files),
with the command above and `lvrtc compare`. Each figure is the largest of its kind over the rays that are ok in
both engines, in waves of the line: of the path to the last surface, of the path to the image plane, and of the
path relative to the chief ray's:

| Suite | R3, pairs of two engines | optiland against `ref` | `lv` against `ref` |
|---|---|---|---|
| `benchmark`, 216 ray sets | 648 `PASS` | 2.7e-9, 2.7e-9, 2.7e-9: `nikon-z-24-70f4s` wide at 470 nm, 43.3° | 6.0e-6, `sigma-35mm-f14-dg-hsm-a` at 510 nm, 31.9°; 5.3e-6, `sony-fe-20mm-f18-g` at 470 nm, 47.5°; 5.5e-6, `nikon-z-24-70f4s` tele at 470 nm, 16.6° |
| `features`, 162 ray sets | 482 `PASS`, 4 `FLOOR` | 3.0e-9, `fixed-iris-zoom` wide at 39.3°; 3.1e-9, `asphere-a20` at 24.2°; 3.5e-9, `rear-plate-rim` at 17.7°: all at 470 nm | 3.8e-6, `e-line` at 12.1°; 2.07e-5 and 2.28e-5, `stop-inside-element` at 470 nm, 55.3° |
| the contract's three cases and twelve systems made for the two rungs, 51 ray sets, against `ref` | 51 `PASS` | 2.5e-9, a surface set into the curve before it; 1.9e-9, the case of every feature; with a chief ray, in a request of the test's own, 1.7e-9 | no case of LensVisualizer |
| the 24 focus stations LensVisualizer certifies, on the reference line, 72 ray sets | 216 `PASS` | 3.9e-9, `sigma-35mm-f12-dg-ii-art` at its closest focus, 17.8°; 3.0e-9, `fujifilm-gf80-f17`, 18.3°; 3.3e-9, `sigma-50mm-f12-dg-dn-art`, 25.4° | 8.1e-6 and 8.3e-6, `fujifilm-gf80-f17` at its closest focus, 18.3°; 5.9e-6, `sigma-24mm-f2-dg-dn-contemporary`, 44.5° |

`lv` against optiland has the figures of `lv` against `ref` to two digits. The four floors are the Hologon's again,
at its full field at 470 nm and 510 nm, against `ref` and against optiland alike: the ray leaves 54° off the axis,
and LensVisualizer's 2.2e-9 mm on the last surface is 2.07e-5 waves on the image plane. The reason names the
witness:

```
opd.maxAbs 2.28e-5 exceeds its tolerance 2.00e-5 at field 5.53e1, line 1, ray 264; opticalPathToImage.maxAbs
2.07e-5 exceeds its tolerance 2.00e-5 at field 5.53e1, line 1, ray 264; floor of lv: optiland against ref
opd.maxAbs 4.23e-10 within 1.00e-7, optiland against ref opticalPath.maxAbs 6.05e-11 within 1.00e-7, optiland
against ref opticalPathToImage.maxAbs 4.23e-10 within 1.00e-7, lv against ref opd.maxAbs 2.28e-5 within 2.00e-4,
lv against ref opticalPath.maxAbs 1.73e-6 within 2.00e-4, lv against ref opticalPathToImage.maxAbs 2.07e-5 within
2.00e-4
```

The path relative to the chief ray is measured wherever every engine lands that ray: in every set of the
benchmark, in all but six of the feature suite (the full field of `fixed-iris-zoom` at its wide end, where an
aperture stops the chief ray for all three) and in all but one at the stations; there the two paths are judged
alone, and the pair says so. A case file's probe lattice states no chief ray at all. Traced in 60-digit
arithmetic, the rays that set optiland's figures above have optiland 2.7e-9, 3.5e-9 and 3.9e-9 waves from the
truth and `ref` within 1.6e-10; the Hologon's ray has LensVisualizer 2.07e-5 and 2.28e-5 from it, optiland
1.8e-10 and `ref` 6e-11. So in the suites and at the stations optiland agrees with the arbiter twenty-five times
more closely than the floor rule asks of a witness (1e-7 waves), and what it differs by is its own: the hits of its
plain sums on an asphere, which move a path by half of what they are off
([docs/gotchas.md](gotchas.md#optilands-optical-path-is-a-plain-sum-and-as-exact-as-its-hits)).

**Outside the suites it does not always, in R3 as in R2.** On the four lenses on which optiland's hits are no
witness, each on its reference line and the photopic lines, the zoom at both ends (90 ray sets, outside the
tests), every pair of optiland passes R3, and optiland is this far from `ref`, in waves, where the 60-digit trace
puts `ref` within 3.1e-9 of the truth on the worst ray and the rest on optiland:

| Lens | optiland against `ref`: path, to the image, relative | R3 of `lv` against `ref`, alone | beside optiland |
|---|---|---|---|
| `fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr`, wide end | 4.3e-7, 4.5e-7, 4.5e-7 at 62.8°, 610 nm | 14 `PASS`, 4 `FLOOR` | 14 `PASS`, 4 `FAIL` |
| the same, tele end | 1.6e-8, 1.7e-8, 1.8e-8 | 18 `PASS` | 18 `PASS` |
| `fujifilm-fujinon-xf-27mm-f28` | 8.9e-7, 9.7e-7, 9.7e-7 at 27.6°, 510 nm | 16 `PASS`, 2 `FLOOR` | 16 `PASS`, 2 `FAIL` |
| `apple-iphone-7-wide-camera-lens` | 1.7e-8, 1.8e-8, 1.7e-8 at 21.0°, 470 nm | 18 `PASS` | 18 `PASS` |
| `russar-22-70f8` | 1.2e-9, 2.7e-7, 2.8e-7 at 65.1°, 510 nm | 13 `PASS`, 5 `FLOOR` | 13 `PASS`, 2 `FLOOR`, 3 `FAIL` |

Every figure is inside the gate of R3 by a factor of twenty or more. Under policy version 4, which the last
column is of, it cost the floor: 9 of the 11 pairs of `lv` that are `FLOOR` beside `ref` alone were `FAIL` beside
optiland, "optiland does not agree with ref", as 14 of 17 were in R2 on the same sets. LensVisualizer's own
largest figures there are 7.8e-5 waves (the zoom), 1.4e-4 (the 27 mm) and 3.4e-5 (the Russar), all inside the
floor's limit of 2e-4. The owner decided it on these figures: since policy version 5 a witness that does not
corroborate withholds no floor, and is named in the reason; only one that sides with `lv` against `ref` does
([the plan's amendment](IMPLEMENTATION_PLAN.md#a-witness-does-not-withhold-a-floor)). These lenses are outside
the suites and were not run again for it.

**A far origin** is what would cost optiland's path most, and no ray of LensVisualizer has one. optiland solves a
conic from where the ray is, and half of what that costs the hit is in the path: on a front sphere of radius
30 mm, 2.2e-8 waves from 2.3 m, 6.5e-7 from 16 m and 5.5e-5 from 100 m, beyond the gate; a tenth of that on a
radius of 300 mm. LensVisualizer launches the rays of a finite conjugate from a plane 18 mm to 75 mm in front of
the lens, along the lines from the object point, so a station's paths start there. The probe lattice of a case
file with a finite object does start at the object point
([docs/gotchas.md](gotchas.md#a-conic-is-met-from-where-the-ray-is-and-from-far-away-that-costs-the-square-of-the-distance)).

**What a trace costs**, measured on the benchmark's 216 ray sets (235 812 rays, 18 to 39 surfaces) sent to one
worker one after another: 14 ms a set, of which 0.8 ms are reading the request's arrays and checking them, 2.8 ms
building the line's optic and reading it back, 9 ms optiland's trace and the reading of its rows, and 0.9 ms
writing the answer; 4.8 s for all of them. The first trace of a worker takes 0.08 s more, and 0.9 s on an empty
cache directory, while numba compiles; a run may take ten minutes for a reply. The worker logs each trace on its
standard error (rays, surfaces, how they ended, the four times, its peak memory and its process id): an answer
holds no time. One process serves a run, which a test counts. Its memory is that of optiland's import, 595 MiB
with vtk, matplotlib, scipy and numba, and 700 MiB at its peak over the benchmark, 735 MiB after three passes of
it: a request's optic and arrays are garbage once it is answered, and with that garbage collected the worker
holds the same number of objects after every pass.

**Nothing is written into the optiland checkout or its environment.** Importing optiland imports numba,
matplotlib and vtk, each of which writes somewhere unless told where, so the worker's environment says where,
under the configuration's `cacheDir` (`.cache/optiland`, gitignored):

| Variable | Why |
|---|---|
| `NUMBA_CACHE_DIR` | numba caches the machine code of optiland's `@njit(cache=True)` functions beside their sources otherwise, and already on import it creates and removes a file in each such `__pycache__` to see whether it may |
| `MPLCONFIGDIR`, `MPLBACKEND=Agg` | matplotlib's font cache, and no display |
| `PYTHONPYCACHEPREFIX` | bytecode is cached there: with a prefix Python reads and writes no `__pycache__` beside a source |
| `PYTHONDONTWRITEBYTECODE=1` | the interpreter writes no bytecode while it starts; the worker turns the writing on itself once it has checked the prefix, below |

The worker sets the same from inside before it imports anything of optiland (`lvrtc_optiland/hygiene.py`), so one
started by hand is as careful. A cache that would lie inside the directory optiland is imported from, or inside
the interpreter's virtual environment, is refused before a directory is made and before numba is imported: a
`cacheDir` that points there makes the engine unavailable and writes nothing. After the import the worker checks
that numba caches where it was told, that its JIT is on, and that optiland computes with numpy in float64. In
every such case it refuses `hello` with the reason. The JIT stays on: optiland is compared as it runs, and numba's
own `NUMBA_DISABLE_JIT` is not obeyed. The worker's standard output is reserved for replies at the level of the
file descriptor before optiland is imported, so a warning of numpy or a `print` in a library is a line of the log.

**One worker runs without the JIT, and says so**: the one started with `LVRTC_OPTILAND_JIT=off`, a switch of the
worker's own that nothing in the comparator sets but the test that compares the two. Its descriptor states
`jit: false`, which is part of the fingerprint, so its answers are another engine's to the result store and are
never found there in place of optiland's as it runs. Any other word than `on` and `off` refuses `hello`.

**Bytecode is cached, under the cache directory and nowhere else.** The stdio transport starts every worker with
`PYTHONDONTWRITEBYTECODE=1`, and a definition can replace a variable of the transport but not remove one. So the
switch is the worker's: `hygiene.prepare` first refuses a prefix that lies inside optiland, then names it
(`sys.pycache_prefix`), and only then lets this interpreter write (`sys.dont_write_bytecode = False`). What is
imported after that, which is numpy, scipy, numba, matplotlib, vtk and optiland, is compiled once and read from
the cache on every later start; what was imported before, the worker's own first modules, is written nowhere. A
process the worker starts is still told not to write.

**Starting takes time.** `hello` is answered once optiland is imported: about 3 s on this machine with warm
caches, and about 18 s the first time, when matplotlib builds its font cache and 2900 modules are compiled and
their bytecode written. Until Stage 2.2 no bytecode was kept and a warm start took 6 s, half of it compiling. The
engine's `hello` may take three minutes (`OPTILAND_TIMEOUTS`) where every other engine's may take 30 s.

**What the JIT costs and saves**, measured at optiland `4e893f53` on a synthetic singlet of two spherical surfaces
with 4096 rays given to `surfaces.trace`: the first trace of a process takes 0.9 s on an empty numba cache, while
the conic intersection is compiled, and 0.23 s once it is cached; every later one 0.8 ms. With the JIT off a
trace takes 20 ms, the first like the rest. One `FFTMTF` of that singlet on the axis (128 rays across the pupil)
takes 17 ms with the JIT on and 31 ms with it off. The landing points are the same bits either way. So are the
answers of a whole run: traced once with the JIT and once without, all 378 ray sets of the two suites come back
as the same bytes, every array of every answer, and no figure of any pair of R2 moves. Without the JIT the
benchmark's 216 sets take the worker 20 s in place of 5 s.

**When it cannot be used** the engine is unavailable and every other engine carries on:

| Code | When | The message says |
|---|---|---|
| `not-configured` | `engines.optiland.python` is `null` | to set it in `lvrtc.local.json`, or `LVRTC_OPTILAND_PYTHON` |
| `spawn-failed` | the interpreter it names is not on this machine | its path, and the same |
| `hello-failed` | the interpreter cannot import optiland, numpy, scipy or numba; or optiland is not in the state the worker computes in; or `cacheDir` lies inside the optiland checkout or its environment | the interpreter and Python's own error, and for an import that failed the same |

**Who it is.** The fingerprint is a hash over the commit and dirty flag of the optiland checkout, a hash of the
package's Python sources, the versions of Python, numpy, scipy and numba, and whether the JIT is on; the
distribution's version string is no part of it, because it ends in the day of the install; the version the engine
states is that string without the day (`0.6.2.post117+g4e893f53`), so that no manifest or report holds a date. The
worker's own sources are not the engine: they are the adapter revision, a hash of `workers/python/lvrtc_optiland`
and the kit, and the result store keys an answer by both ([contract](../contract/CONTRACT.md#engine-descriptor)).
`lvrtc doctor` prints all of it, and `python -m lvrtc_optiland --identity` prints the identity as one line of JSON.

```bash
npm run test:optiland
```

Runs the tests against the real optiland (`test/integration/optiland`), with the interpreter of the configuration:
the Python tests of the worker (`workers/python/tests/optiland`, none skipped: the builder on every shape and
mapping, the mistakes it must catch, optiland's first-order data held to values derived by hand, and its rays
held to closed forms and to a trace in 60 digits), the conformance kit, a run in which R0 to R3 are answered and
the conformance rung `unsupported`, `lvrtc doctor`, and a
recursive snapshot of the optiland checkout and its environment (path, size and modification time of every file
and directory) taken before the first test and after a cold start on an empty cache directory, with the JIT
compiling and the bytecode being written: nothing may differ. `r0.test.ts`, `r1.test.ts` and `r2.test.ts` run
rungs R0, R1 and R2 through the commands: the contract's cases and systems made for the rung against `ref`, which
need optiland only, and the benchmark and feature suites on `lv`, `ref` and `optiland`, which need LensVisualizer
too. `r1.test.ts` also asks the three engines in its own process, without ray sets: at every focus station
LensVisualizer certifies, and optiland against `ref` over every lens of the catalog that exports, a zoom at both
ends. `r2.test.ts` holds every pair of a suite to `PASS` or `FLOOR` with no ray stopped by one engine and passed
by another, and optiland to the agreement with `ref` that the floor rule asks of a witness; it runs each suite a
second time with optiland without the JIT, and counts the worker processes a run starts, which is one.
`r3.test.ts` runs each suite on all four rungs, as Phase 2 states its benchmark, holds every pair of R3 to `PASS`
or `FLOOR` and optiland's paths to 1e-7 waves of `ref`'s, to the last surface, to the image plane and relative to
the chief ray; a request of its own gives the contract's cases a chief ray, which their probe lattices lack, and
another states the same rays with directions 4.5e-13 longer and holds each engine to the same paths.
`stations.test.ts` holds the rays of every focus station LensVisualizer certifies, which diverge from an object
point, to both rungs. What the three share is `traced.ts`. The Python tests of the path are `test_path.py`: what
optiland's sum is made of, and closed forms of a plate, of the two Cartesian conics, of the aplanatic points of a
sphere, of a lens of two spheres traced by hand and of a step backwards; and what optiland makes of a direction
that is no unit vector, in its steps and in its refraction. Each test skips with the reason when
optiland, or LensVisualizer where it is needed, is not configured or cannot be used.

## Phase 2: R0 to R3 on three engines

Phase 2 of the plan ends with the two suites on `lv`, `ref` and `optiland` through rungs R0 to R3, at the
reference line and the five photopic lines, every gated pair `PASS` or `FLOOR`.

```bash
node bin/lvrtc.mjs run suites/benchmark.json --engines lv,ref,optiland --rungs r0,r1,r2,r3
```

Has each of the three engines build every case, give its first-order data and trace the rays LensVisualizer
launches; `lvrtc compare benchmark` then judges every two of them on every rung, and exits with 1 if a pair
fails. The benchmark takes 28 s and the feature suite (`suites/features.json`) 19 s.

Measured at optiland `4e893f53` and LensVisualizer `c05a2ab7` (engine closure `78215d72`, 151 files), and
committed as baselines under policy version 5, which gives these suites the verdicts version 4 gave them
([Baselines](#baselines)). Pairs of two engines, as each rung judges them:

| | Runs, ray sets, rays that every engine lands | R0 | R1 | R2 | R3 |
|---|---|---|---|---|---|
| `benchmark` | 24 runs, 216 ray sets, 137 596 of 235 812 rays | 72 `PASS` | 72 `PASS` | 648 `PASS` | 648 `PASS` |
| `features` | 18 runs, 162 ray sets, 104 846 of 185 522 rays | 54 `PASS` | 54 `PASS` | 482 `PASS`, 4 `FLOOR` | 482 `PASS`, 4 `FLOOR` |
| the 24 focus stations LensVisualizer certifies, on the reference line | 24 runs, 72 ray sets, 50 357 of 100 004 rays | 72 `PASS` | 72 `PASS` | 214 `PASS`, 2 `FLOOR` | 216 `PASS` |

`lvrtc compare` counts a pair in both of its modes and says 2400 `PASS` for the benchmark, 1784 `PASS` and 16
`FLOOR` for the feature suite, and 956 and 4 for the stations: no `FAIL`, no `ERROR`, nothing `UNSUPPORTED` and
nothing `BLOCKED`. No ray is stopped by one engine and passed by another, none lies in a rim band, and no engine
fails one. The largest figure of each kind, of optiland against `ref` and, after the stroke, of `lv` against `ref`
(`lv` against optiland is the same to two digits):

| Rung | Figure, and its gate | `benchmark` | `features` | focus stations |
|---|---|---|---|---|
| R0 | sag on the scale of its rounding, 1e-12; every other value of the built system is equal | 4.5e-16 / 4.0e-16 | 3.3e-16 / 2.7e-16 | 6.0e-16 / 3.8e-16 |
| R1 | a value that is no pupil's, 1e-9 mm | 1.8e-12 / 1.6e-12 | 5.0e-14 / 5.3e-14 | 3.3e-13 / 3.8e-13 |
| R1 | a pupil's position, 1e-9 mm | 1.0e-12 / 3.4e-13 | 9.9e-14 / 8.5e-14 | 7.1e-14 / 2.0e-13 |
| R1 | a pupil's radius, 1e-9 mm | 5.7e-14 / 4.3e-14 | 9.8e-15 / 7.1e-15 | 4.6e-14 / 3.9e-14 |
| R2 | a hit on a surface, 1e-8 mm | 1.2e-12 / 6.8e-9 | 1.1e-12 / 2.3e-9 | 4.5e-12 / 1.12e-8 |
| R2 | the exit direction, 1e-9 | 2.1e-14 / 3.1e-10 | 1.3e-14 / 2.1e-10 | 6.8e-14 / 1.4e-10 |
| R2 | the landing, 1e-8 mm | 8.9e-13 / 9.1e-9 | 5.9e-13 / 1.10e-8 | 4.6e-12 / 1.14e-8 |
| R3 | the path to the last surface, 2e-5 waves | 2.7e-9 / 6.0e-6 | 3.0e-9 / 3.8e-6 | 3.9e-9 / 8.1e-6 |
| R3 | the path to the image plane, 2e-5 waves | 2.7e-9 / 5.3e-6 | 3.1e-9 / 2.07e-5 | 3.0e-9 / 8.3e-6 |
| R3 | the path relative to the chief ray's, 2e-5 waves | 2.7e-9 / 5.5e-6 | 3.5e-9 / 2.28e-5 | 3.3e-9 / 5.9e-6 |

- **optiland and `ref`** share no code and agree on every traced ray to a two-thousandth of each gate of R2 and
  R3 or better: inside what the floor rule asks of a witness (1e-10 mm, 1e-12, 1e-7 waves) by a factor of 22 in a
  hit, 14 in the exit direction and 25 in a path, each at its worst, which is a focus station's. What they differ
  by is optiland's, by the 60-digit trace of the rays that set each figure.
- **The floors are LensVisualizer's**: the Hologon of the feature suite (`stop-inside-element`) at its full field
  at 470 nm and 510 nm, in R2 by its landing and in R3 by its path to the image plane, against `ref` and against
  optiland alike; and one station, `fujifilm-gf80-f17` at its closest focus and full field, in R2 by a hit
  1.12e-8 mm off. Each is its intersection tolerance of 1e-9 mm behind a steep surface, a figure a tighter
  tolerance in LensVisualizer would turn into a `PASS` ([docs/gotchas.md](gotchas.md)).
- **What these tables do not say** is in the sections above and in [docs/gotchas.md](gotchas.md#optiland): on
  some lenses outside the suites optiland loses rays or carries them where the case has no surface, which fails
  its pairs in R2, and on four it is far enough from `ref` to withhold a floor from LensVisualizer, in R2 and in
  R3 until policy version 5 changed what a witness may withhold. The committed record of the two suites is
  [reports/benchmark/rays.md](../reports/benchmark/rays.md) and
  [reports/features/rays.md](../reports/features/rays.md), each rendered from its baseline.

The tests that hold all of it are `npm run test:optiland`: `r0.test.ts` to `r3.test.ts` and `stations.test.ts`
in `test/integration/optiland`. `r3.test.ts` runs the command above on each suite, all four rungs at once, and
`stations.test.ts` the two rungs of traced rays.

## Baselines

A baseline is the committed record of one compared run of a suite: `baselines/<suite>.json`
([the contract's `baseline`](../contract/CONTRACT.md#baseline)). For every run **as it was run** (a zoom at each
end), every rung and every pair of engines it holds the verdict, each metric with its worst value and where it
occurs, how the rays of each engine ended and the rim band's count, and what all of that is of: the content hash
of the run's case, each engine's id, fingerprint and adapter revision with the commit it states, and the policy's
version and hash. It holds no ray, no prescription, no time and no path, and is canonical JSON: the same run gives
the same bytes anywhere.

**To write the two that are committed**, on the checkouts of `lvrtc.config.json`:

```bash
node bin/lvrtc.mjs run suites/benchmark.json --engines lv,ref,optiland --rungs r0,r1,r2,r3,r4
node bin/lvrtc.mjs compare benchmark
node bin/lvrtc.mjs baseline write benchmark
node bin/lvrtc.mjs run suites/features.json --engines lv,ref,optiland --rungs r0,r1,r2,r3,r4
node bin/lvrtc.mjs compare features
node bin/lvrtc.mjs baseline write features
```

`lvrtc baseline write <suite name | run directory> [--root <dir>]` asks no engine anything. It writes
`<root>/baselines/<suite>.json` and the report rendered from it, `<root>/reports/<suite>/rays.md` and `rays.json`:
the inputs (engines with fingerprints and what they were taken at, the policy, every run with its case hash), per
rung the pairs of engines by verdict, the support matrix, the worst of every metric of every pair with its run and
place, and a row per run with each pair's verdict, the judged metric that is largest against its tolerance, and
the ray counts. It refuses (exit 2) a run with an engine that could not be used, a run that was not started, a
LensVisualizer that changed during the run, and comparisons of another manifest or policy; and (exit 1) a run with
a pair that is `FAIL` or `ERROR`: a baseline records what the engines agreed on.

`lvrtc baseline check <suite name | suite.json> [--root <dir>] [--json]` needs the engines. A suite name is
`<root>/suites/<name>.json`. It runs the suite again on the baseline's engines and rungs into the configured runs
directory, where the result store answers whatever has not changed, compares it and writes `comparisons.json` as
`lvrtc compare` does, and sets every record of the baseline (a pair of engines in one rung of one run) against the
same record of that run:

| State | When | What to do |
|---|---|---|
| `OK` | the case hash, both engines' fingerprints and adapter revisions and the policy are the baseline's, and the record is what it was | nothing |
| `STALE(case)` | LensVisualizer now exports another case for the run: a lens file was edited | see the outcome |
| `STALE(engine)` | the fingerprint or the adapter revision of one of the two engines is another | see the outcome |
| `STALE(policy)` | the policy's hash is another | see the outcome |
| `REFRESHABLE` | stale, and the verdicts are the same and no judged metric moved by more than its tolerance | `lvrtc baseline write <suite>`, then commit `baselines/` and `reports/` |
| `DRIFT` | stale or not, a verdict changed or a judged metric moved by more than its rung's tolerance | find the cause first (`lvrtc report <suite>`, [docs/gotchas.md](gotchas.md)); only then write |
| `NEW`, `GONE` | the suite as it runs has a record the baseline lacks, or lacks one it has | `lvrtc baseline write <suite>` once the suite is what is wanted |

Every record that is not `OK` is a line, then the counts, then what to do for each state present. Exit code: 1
when a record is `DRIFT`, when a pair is `FAIL` or `ERROR` today, and when an engine could not be used or
LensVisualizer changed under the run; 0 otherwise, stale or not; 2 when nothing was checked (no suite file, no
baseline). The check leaves the run it made in the runs directory, so `baseline write` after a `REFRESHABLE`
needs no second run. A baseline is of one selection of engines and rungs, the same for every run of the suite;
a rung that is about engines of its own is checked on those, and they are named for no other rung.

`lvrtc verify [--root <dir>] [--write]` is hermetic and part of `npm run check`: it reads no engine, and passes
with `LVRTC_LV_PATH` and `LVRTC_OPTILAND_PYTHON` pointing nowhere. Every `baselines/*.json` must be a baseline by
its schema and its rules, be the canonical text of its content (an edit by hand is not), be named after its suite
and be judged by the policy at hand; `reports/<suite>/rays.md` and `rays.json` must be, byte for byte, what the
baseline renders; no such report may be without its baseline. `--write` writes the reports anew from the baselines
(after a change to the renderer) and never writes a baseline. **It cannot see `STALE`**: a case or an engine that
has changed since needs the engines, and is what `baseline check` says.

**When to rewrite.** After a change to the policy (verify fails until the baselines are of the new one), to `ref`
or to an adapter (`STALE(engine)`), after LensVisualizer's engine files or the lenses of a suite change, and after
a suite changes. `npm run test:optiland` runs `baseline check` on both suites and holds every record that is not
stale to `OK`; a stale record is reported there and fails nothing.

**Since Stage 3.2** the baselines are of policy version 6 and of LensVisualizer `33ebdb30` (the same engine
closure, `78215d72`). The benchmark's holds the suite's 96 runs
([the benchmark in four conditions](#the-benchmark-in-four-conditions)): 1152 records, all `PASS`. The 288 records
of the 24 runs it held before, and the 216 of the feature suite (212 `PASS`, 4 `FLOOR`), are what they were in
every verdict, figure and count; 864 records are new, those of the 72 runs at f/8 and at LensVisualizer's best
focus. From an empty store `lvrtc baseline check benchmark`, which is the suite's run on three engines and its
comparison, takes about two and a half minutes, and the feature suite's 24 s (measured within
`npm run test:optiland`).

**Since Stage 3.3** the baselines are of policy version 7 and hold R4 beside R0 to R3: 1440 records of the
benchmark (96 runs, five rungs, three pairs of engines), all `PASS`, and 270 of the feature suite (266 `PASS`,
4 `FLOOR`). The 1152 and 216 records of R0 to R3 are what they were in every verdict, figure and count; 288 and 54
are new, those of R4, at the same LensVisualizer `33ebdb30` and the same fingerprints and adapter revisions. R4 is
in the baselines because they take it as they are: its requests are those of R2 and R3, so a check traces nothing
more for it, `reports/<suite>/rays.md` states its worst figure for every pair of engines with the run, the field
and the frequency, and `npm run test:optiland` holds it on all 96 runs without a second trace. On a warm store it
adds about 45 s to `lvrtc baseline check benchmark`: the recipe of each run, and the estimator.

**R4f is in no committed baseline yet**, and the commands above do not name it for that reason: the
MTF baselines are Stage 3.8. A baseline can hold it. One written from a run with `r4f` names the engine `replay`
and has a record of `lv` and `replay` for every run, and `baseline check` then runs the rungs that compare the
engines of a run on the engines the baseline names for those, and leaves `r4f` to ask its own two
(`test/cli/fidelityLadder.test.ts`). Until Stage 3.8, R4f is held by `npm run test:lv`
(`test/integration/lv/fidelity.test.ts`), on all 96 runs.

**R6a and R6b are in no committed baseline either.** R6a's finer lattice is 15 GB of traces and 8 minutes on the
benchmark, which every `baseline check` would repeat; R6b is 13 minutes of LensVisualizer. Until Stage 3.8 decides
what the MTF baselines hold, R6a is held by `npm run test:optiland` on 17 runs
(`test/integration/optiland/r6a.test.ts`) and R6b by `npm run test:lv` on six
(`test/integration/lv/wave.test.ts`); their figures on all 96 runs are
[above](#rungs-r6a-and-r6b-the-wave-mtf).

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
method and a request that is not valid by the contract are answered
`{ "ok": false, "error": { "code", "message" } }`. An exception in an engine's `run` is the engine's failure on
that request and no fault of the protocol: it is answered `ok: true` with a result of status `error` and the code
`engine-failure`, as the engines of the comparator's own process answer it. A worker echoes the ids it is given
and never recomputes them.

Standard output carries replies only, and that is kept at the level of the file descriptor: `protect_stdout()`
duplicates descriptor 1 for the replies and points descriptor 1 itself at the standard error, so a `print`, a
warning, a C library and a process the worker starts all write to the log. `serve_stdio` does it for a worker
that has not; a worker whose engine may write while it is imported calls it first.

The Python fake engine and the TypeScript one are interchangeable: for one request they give byte-identical
results. The kit's tests are `unittest`, in `workers/python/tests/kit`, and run the validator against the same
fixture corpus as the TypeScript tests; those of the optiland worker are beside them, in
`workers/python/tests/optiland`, and run on a fake optiland (`test/fixtures/fake-optiland`) under any Python:

```bash
python3 -m unittest discover -s workers/python/tests/kit -t workers/python
python3 -m unittest discover -s workers/python/tests/optiland -t workers/python
```
