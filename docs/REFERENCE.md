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
| `benchmark.json` | the 12 benchmark configurations (11 lenses, `nikon-z-24-70f4s` at both ends of its zoom), each on its reference line and on the photopic lines |
| `features.json` | one lens for each translation path the benchmark lacks, named after the path: an odd-order asphere, an e-line lens, a term of power 20, an asphere on a flat base, an authored rear-plate rim, a fixed-iris zoom (at both ends: it states no position), an asphere without a term, a stop inside an element: 16 runs as written, 18 as run |

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
  engine, and `lv`, LensVisualizer itself. It can be named under any root, and is run only where it is named, so a
  root without an engine of its own runs nothing until `--engines` or the suite names one; the committed suites
  name both. A configured engine of the same id takes its place.
- **Rungs** are every rung, unless the run lists its own `rungs`; `--rungs` replaces both. They are, in the order
  of the ladder: `selftest` (the conformance quantity `selftest.echo`), `r0` (`system.describe`), `r1`
  (`paraxial.first-order`), and `r2` and `r3` (`rays.trace`), which ask every engine to trace the run's ray sets.
  The two ask the same requests, so an engine traces a set once and the second rung finds the answer in the
  store. An engine that does not offer a rung's quantity, or implements another version of its definition than
  the comparator's, is recorded as `unsupported` for it without being asked.
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
  the item `system.afocal` or `surface.asphere.linear-term`.

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
  A pair of `lv` that is above a gate is `FLOOR`, a pass that is counted apart, when the arbiter `ref` agrees with
  every other engine within 1e-10 mm, 1e-12 in direction and 1e-7 waves, and `lv` is within 1e-7 mm, 1e-8 in
  direction and 2e-4 waves of `ref`: ten times each gate. Otherwise it is `FAIL`. Every one of those figures is
  held together, whichever is above its gate: a direction within its limit excuses no hit beyond its own. The
  limits are in `policy/rungs.v1.json`. A mask mismatch has no floor: a ray that one engine stopped and the other
  passed always fails.

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

**The committed record** is [reports/benchmark/lv-floor.md](../reports/benchmark/lv-floor.md), with
`lv-floor.json` beside it: for every run and rung of the benchmark the largest value of each metric, the verdicts,
and how the rays of each engine ended, with the LensVisualizer commit and engine closure it was taken at, the hashes
of both engines' code here, and the content hash of each run's case. The last says what was traced even where the
commit cannot, in a checkout whose lens files are being edited (`dirty`). It holds results, counts, run names and
hashes, and nothing an engine traced. The three commands that write it are in [the README](../README.md#compare-engines); an
integration test holds its figures to a fresh run for as long as LensVisualizer's engine files and those cases are
the ones it names. It names `ref` and the `lv` adapter by hash too: write it again after changing either.

## LensVisualizer's product MTF

`mtf.native` is the quantity for an engine's own MTF: by its own method, sampling and aiming, as it presents it.
No two engines are expected to agree on it within a tolerance, and no rung compares it yet. LensVisualizer's is
the one every later comparison is against, so it has to be obtained exactly as LensVisualizer obtains it.

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
and run by run. The digest lists the metrics in the order the comparator reports them, so there too a plain
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

**It answers `system.describe`, which is rung R0.** A run on it is answered `unsupported` for every other rung;
those arrive with the stages that follow.

```bash
node bin/lvrtc.mjs run suites/benchmark.json --engines lv,ref,optiland --rungs r0
```

Builds every case of the suite in optiland and asks all three engines for the system they built; `lvrtc compare
benchmark` then judges each pair of engines.

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
| the line | the optic's only wavelength, in µm, and primary |

**Nothing is answered about an optic that is not the case.** After building, the worker reads every one of those
values back from optiland's own objects and holds it to the case (`verify_optic`): the vertex in the geometry's
frame and on optiland's paraxial axis, the class of the geometry, its radius, conic constant and terms, the Newton
settings of an asphere, the class of the aperture and its two radii, the semi-aperture, the stop flag, that the
surface refracts by optiland's ordinary model (a plane that optiland was given as a thin lens is a `Plane` too, and
gave a system of the every-feature case a focal length of 19 mm for 27 mm), without a coating, the index, the
object and image planes, the stop diameter and the wavelength. Then it holds the sag optiland evaluates, at
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
optiland. It does not yet answer first-order data: optiland's own does not see a term of power 2
([docs/gotchas.md](gotchas.md#optilands-first-order-data-does-not-see-a-term-of-power-2)), which Stage 2.3 has to
refuse.

Measured at optiland `4e893f53` and LensVisualizer `b7deb221` (engine closure `46b028bc`), with the command above
and `lvrtc compare`, and again at `1bf669ee` (closure `66027121`) with every figure the same:

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
every such case it refuses `hello` with the reason. The JIT stays on: optiland is compared as it runs. The worker's
standard output is reserved for replies at the level of the file descriptor before optiland is imported, so a
warning of numpy or a `print` in a library is a line of the log.

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
takes 17 ms with the JIT on and 31 ms with it off. The landing points are the same bits either way.

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
mapping, and the mistakes it must catch), the conformance kit, a run in which R0 is answered and every other rung
`unsupported`, `lvrtc doctor`, and a recursive snapshot of the optiland checkout and its environment (path, size
and modification time of every file and directory) taken before the first test and after a cold start on an empty
cache directory, with the JIT compiling and the bytecode being written: nothing may differ. `r0.test.ts` runs rung
R0 through the commands: the contract's cases against `ref`, which needs optiland only, and the benchmark and
feature suites on `lv`, `ref` and `optiland`, which need LensVisualizer too. Each test skips with the reason when
optiland, or LensVisualizer where it is needed, is not configured or cannot be used.

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
