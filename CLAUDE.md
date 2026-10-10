# LensVisualizer Ray-Trace Comparator

Cross-checks LensVisualizer (LV) against external optical engines. The plan, with phases, stages and the comparison
ladder, is `docs/IMPLEMENTATION_PLAN.md`. Work one stage per commit; every stage has its own tests.

## Commands

```bash
npm run check          # typecheck + lint + format:check + test; run before every commit
npm run typecheck      # tsc --noEmit
npm run lint           # eslint .
npm run format         # prettier --write
npm test               # node --test on test/**/*.test.ts, except test/integration
npm run test:python    # unittest for the Python worker kit and the optiland worker on a fake optiland; part of check
npm run test:lv        # tests against the real LensVisualizer (test/integration/lv); NOT part of check
npm run test:optiland  # tests against the real optiland (test/integration/optiland); NOT part of check; the suites, focus stations and catalog sweep need LV too; r2 needs a POSIX shell
node bin/lvrtc.mjs     # the CLI
node bin/lvrtc.mjs doctor   # Node, config layers, LV, Python and optiland as this machine sees them
node bin/lvrtc.mjs run test/fixtures/suites/fake-pair.json --root test/fixtures/fake-root   # a suite on fake engines
node bin/lvrtc.mjs compare fake-pair --root test/fixtures/fake-root   # compare a run: writes comparisons.json
node bin/lvrtc.mjs report fake-pair --root test/fixtures/fake-root    # report a compared run: report.json, report.md
node test/contract/writeCorpus.ts   # rewrite contract/fixtures after editing test/contract/corpus.ts
node test/report/writeGolden.ts     # rewrite test/fixtures/golden after a change meant to change a report
node bin/lvrtc.mjs engine conformance fake-py --root test/fixtures/fake-root   # the conformance kit on one engine
node bin/lvrtc.mjs lenses list                 # every LensVisualizer lens: key, name, file
node bin/lvrtc.mjs lenses show nikkor-z50f12   # one lens as LV prepares it for tracing (console only)
node bin/lvrtc.mjs export nikkor-z50f12        # one lens as an engine-neutral case (stdout; never committed)
node bin/lvrtc.mjs export --all --census reports/census   # every lens, a zoom at both ends; rewrites the census
node bin/lvrtc.mjs run suites/benchmark.json --engines lv,ref --rungs r0,r1   # real lenses on the built-in engines
node bin/lvrtc.mjs run suites/benchmark.json --engines lv,ref --rungs r0,r1,r2,r3,r4   # with LV's own launch rays traced, and the geometric MTF of them
node bin/lvrtc.mjs run suites/benchmark.json   # the suite's own engines (lv, ref) on every rung; selftest is unsupported by both; r4f adds lv and replay; r6a traces a lattice twice as fine and r6b adds lv and wave: a long run, so name --rungs r0,r1,r2,r3,r4 for the baselined rays rungs
node bin/lvrtc.mjs run suites/benchmark.json --rungs r4f   # R4f: lv against the replay of its own MTF sampling, 96 runs (about 3 min); asked of lv and replay whatever --engines names
node bin/lvrtc.mjs engine conformance replay   # the conformance kit on the replay engine (needs LV)
node bin/lvrtc.mjs run suites/benchmark.json --engines lv,ref,optiland --rungs r6a   # R6a: the wave MTF of the same rays, on the run's lattice and one twice as fine (about 8 min and 15 GB of the store from empty)
node bin/lvrtc.mjs run suites/benchmark.json --rungs r6b   # R6b: lv's diffraction MTF beside the wave estimator on its rays; asked of lv and wave whatever --engines names (about 13 min)
node bin/lvrtc.mjs engine conformance wave   # the conformance kit on the wave engine (needs LV)
node bin/lvrtc.mjs run suites/benchmark.json --rungs r5   # R5: lv, optiland and wave side by side, recorded; run only where named; about 8 min; asks optiland again at 512 rays for a run outside its band
node bin/lvrtc.mjs run suites/benchmark.json --rungs r5g   # R5g: LV's geometric MTF beside optiland's own and the replay, recorded; only where named; about 37 min
node bin/lvrtc.mjs run suites/benchmark.json --engines lv,ref,optiland --rungs r4,r4f,r5,r5g,r6a,r6b   # the MTF rungs: about 54 min and 15 GB from an empty store
node bin/lvrtc.mjs baseline write benchmark --mtf   # after that run and compare: baselines/benchmark.mtf.json, reports/benchmark/mtf.*
node bin/lvrtc.mjs baseline check benchmark --mtf   # needs the engines; minutes on a warm store; MOVED (a recorded rung) fails nothing
node bin/lvrtc.mjs compare benchmark           # judge that run: exit 1 on FAIL or ERROR; FLOOR is a pass
node bin/lvrtc.mjs engine conformance ref      # the conformance kit on a built-in engine
node bin/lvrtc.mjs baseline write benchmark    # after run and compare: writes baselines/benchmark.json and reports/benchmark/rays.*
node bin/lvrtc.mjs baseline check benchmark    # needs the engines: OK, STALE, REFRESHABLE or DRIFT per record
node bin/lvrtc.mjs verify                      # hermetic: baselines valid, committed reports byte-identical; part of check
node bin/lvrtc.mjs engine conformance optiland # the same on optiland: starts the Python worker (about 3 s; 17 s on an empty cache)
node bin/lvrtc.mjs run suites/benchmark.json --engines lv,ref,optiland --rungs r0,r1,r2,r3,r4   # three ways: built system, first-order data, LV's launch rays, optical path, geometric MTF; what the baselines are of
node bin/lvrtc.mjs mtf nikkor-z50f12           # the MTF LV's own tab presents; --aperture f/8 for its comparison
node bin/lvrtc.mjs mtf nikon-z-24-70f4s        # a zoom: both ends, two tables; --zoom 1 for the tele end alone
node bin/lvrtc.mjs mtf nikkor-z50f12 --profile benchmark --engines lv,ref,optiland   # the MTF benchmark of one lens: 8 runs (a zoom 16), r4 r4f r6a judged, r6b r5 r5g recorded; prints the MTF report, writes runs/mtf-<lensKey>/
```

## Rules

- **Node `>=24.15.0 <25`, ESM, no build step.** Sources run under Node's native type stripping, so only erasable
  TypeScript is allowed (`erasableSyntaxOnly`): no enums, namespaces or constructor parameter properties.
- **Import TypeScript with `.ts` specifiers** and use `import type` for types (`verbatimModuleSyntax`).
- **Zero runtime npm dependencies.** Validators, hashing and codecs are written here. Dev dependencies are tooling
  only.
- **Tests are `node:test`** in `test/**/*.test.ts`. Unit tests are hermetic: they need neither LV nor optiland.
  Integration tests skip with a stated reason when LV or optiland is not configured.
- **LV and optiland are read-only.** Never edit either checkout. LV is imported only from
  `src/engines/lv/binding.ts`; optiland is called only from `workers/python/lvrtc_optiland`.
- **The LV binding is the only door to LV.** To use one more LV function, add its name to
  `src/engines/lv/manifest.ts` and its signature to `LvApi` in `src/engines/lv/types.ts`; the type check fails
  until the two agree, and the binding checks the export at load time. Types of LV values are local structural
  types: never `import type` from the LV path, so `npm run typecheck` passes with no LV on disk.
- **The LV engine fingerprint covers engine code only.** Lens prescription files (`src/lens-data/**/*.data.ts`,
  `*.teleconverter.ts`) are hashed one by one into the catalog and never into the engine closure.
- **Read a prepared state, not the authored lens.** The runtime stop radius is `state.surfaces[stopIndex].sd`;
  never read a surface's `source` or `base`, `L.stopPhysSD` or `L.totalTrack`. `syntheticKind` in the binding is
  the one reader of `source` (LV keeps the rear-plate flag nowhere else).
- **The exporter translates and never approximates.** What the contract cannot express is a coded problem for
  that run. A rule LV keeps only in its UI (the stop-down formula) is mirrored here with a source canary in
  `test/integration/lv/canaries.test.ts`. Hermetic tests use synthetic numbers only, never an LV-derived value.
- **A zoom is compared at both ends wherever no zoom position is stated** (`src/engines/lv/zoomEnds.ts`): a suite
  run of an LV zoom without `state.zoomT` is two runs, `<name>-wide` and `<name>-tele`; the census and `lvrtc mtf`
  without `--zoom` do the same. Baselines (Stage 2.6) are keyed on those runs as run, by name and case id as the
  manifest lists them, never on the suite file as written. The expansion is the LV case source's
  (`CaseSource.expand`), never `expandSuite`'s, and the runs it gives are ordinary runs; a suite's hash is that of
  the file as written. An explicit position is one state. A prime has no zoom position: one stated for it is taken
  as 0 (`exportCase`). Middle stations are Stage 4.4. `lvrtc export <key>` and `lenses show` stay single-state and
  hint at `--zoom 1` on stderr.
- **Three test tiers.** `npm run check` is hermetic: no LV, no optiland (it must pass with `LVRTC_LV_PATH` and
  `LVRTC_OPTILAND_PYTHON` pointing nowhere). `npm run test:lv` needs LV. `npm run test:optiland`
  (`test/integration/optiland`) needs the interpreter of `engines.optiland.python`, runs the Python tests of the
  worker with it (`workers/python/tests/optiland`, none skipped there), and each test skips with a reason
  (`OPTILAND_UNAVAILABLE`) without it. Hermetic tests of the optiland worker use the fake package
  `test/fixtures/fake-optiland`, copied to a temporary directory (`fakeOptilandRoot`): in place it lies inside this
  repository, whose commit is not the fake's.
- **`optiland` is a built-in engine in a worker** (`src/engines/optiland/definition.ts`): the stdio definition is
  built from `engines.optiland.python` and `cacheDir` and nothing else is configured. Without an interpreter it is
  unavailable (`not-configured`, `spawn-failed`, `hello-failed`), with a message that says what to set, and every
  other engine carries on. Its `hello` may take three minutes (`OPTILAND_TIMEOUTS`); a built-in worker states its
  waits there, never by widening `DEFAULT_ENGINE_TIMEOUTS`.
- **Never start the optiland interpreter without the worker's environment** (`optilandWorkerEnvironment`; in a
  test `optilandPython` of `test/integration/optiland/support.ts`): `NUMBA_CACHE_DIR`, `MPLCONFIGDIR`,
  `PYTHONPYCACHEPREFIX` under `.cache`, `PYTHONDONTWRITEBYTECODE=1`, `MPLBACKEND=Agg`. A bare `import optiland`
  already writes into the checkout: numba probes each `__pycache__` it would cache in. The worker applies the same
  itself (`lvrtc_optiland/hygiene.py`) before it imports optiland, and reserves file descriptor 1 for replies
  first (`protect_stdout`). A cache that would lie inside the optiland checkout or its virtual environment is
  refused before a directory is made or numba is imported (`prepare`), never afterwards. Bytecode is cached under
  `<cacheDir>/optiland/pycache`: `prepare` refuses a prefix inside optiland, names it (`sys.pycache_prefix`) and
  only then sets `sys.dont_write_bytecode = False`; `check` refuses an interpreter whose prefix is not the
  cache's. Never give the optiland definition an empty `PYTHONDONTWRITEBYTECODE`. In `zsh` an unquoted
  `$VARS` holding several assignments is one word: write them out. The JIT stays on, and the backend is numpy in
  float64: never switch either. `NUMBA_DISABLE_JIT` is not obeyed; the one switch is the worker's own
  `LVRTC_OPTILAND_JIT=off`, set only by the test that compares the two, and it changes the fingerprint.
- **The fingerprint of `optiland` is optiland's, the adapter revision the worker's** (`lvrtc_optiland/identity.py`):
  commit and dirty flag of the checkout, a hash of the package's `.py` files, the versions of Python, numpy, scipy
  and numba, the JIT flag; never the distribution's version, which ends in an install date. The adapter revision
  is a hash of the `.py` files of `lvrtc_optiland` and the kit. The result store keys by both. The version the
  engine states, and `details.distVersion`, drop a trailing `.dYYYYMMDD` (`identity.stated_version`), so no
  manifest or report holds a date.
- **The optiland builder hands over, verifies, then describes** (`workers/python/lvrtc_optiland/build.py`).
  `build_optic` gives the case to optiland; `verify_optic` reads every value back from optiland's own objects
  (vertex, geometry class, radius, conic, terms, `tol`, `max_iter`, aperture class and both radii, stop,
  interaction model, coating, index, the index of the image space, object and image planes, stop diameter,
  wavelength) and holds it to the
  case, then holds optiland's sag to the contract's; `describe_optics` writes `system.describe` from the optics
  and is never given the case. An optic that differs is the error `build-mismatch`, naming surface and field. A
  keyword added to the build needs its read-back check and a test that makes the mistake on purpose
  (`test_build.py`): removing a check must turn a test red.
- **How a case becomes an Optic**: every surface placed by `z=`, never by thickness; one Optic per line
  (`IdealMaterial` is constant and first-order data is the primary wavelength's); `RadialAperture(r_max, r_min)`
  on every surface, the stop included; `float_by_stop_size` takes the stop diameter; an asphere stays
  `even_asphere` or `odd_asphere` whatever its coefficients, the list starting at r^2 (even) or r^1 (odd), with
  `tol=1e-12` and `max_iter=100`; the image surface states the medium after the last surface (optiland takes the
  image space from it); only the non-deprecated API, a deprecated call being an error. Each has an entry under
  optiland in `docs/gotchas.md`.
- **What the builder needs of optiland is imported when the first case is built** (`build.optiland_api`), never
  when the worker loads: the hermetic tier runs the worker on `test/fixtures/fake-optiland`, which has no
  geometries, materials, apertures or rays. A test that needs the real optiland skips with
  `real_optiland_missing()`.
- **`mtf.native` of `optiland` is optiland's own `ScalarFFTMTF`, read from its attributes**
  (`workers/python/lvrtc_optiland/mtf.py`): one line, one field and one sampling a call, each on a new optic
  (`field_optic`), since optiland's aimer keeps what it solved and a number must not depend on what was asked
  before it. The field is optiland's angle field at the spec's angle, alone, without a vignetting factor
  (optiland's frame is the contract's mirrored in y); the pupil is the stop surface out to its clip radius
  (`ray_tracer.set_aiming("robust", max_iter=50, tol=1e-10)`), never `conditions.stopSemiDiameter`; the reference
  is `chief_ray`, tilt kept; `grid_size = 2 * num_rays` is always stated (without it `num_rays` is OpticStudio's
  sampling number: 64 rays for 128). `tangential` is `mtf[0][0]` on `freq_tang`, `sagittal` `mtf[0][1]` on
  `freq_sag`. `engine-best`, a profile and a finite object are `unsupported`, and so are fields as fractions
  without the option `fieldAnglesDeg`; the method "geometric" is answered by `geometric.py`. optiland's FFT takes a grid even on the stop for one even in direction cosines and calibrates its
  axes with four rim rays whatever became of them: both are in `docs/gotchas.md` and neither is corrected by the
  worker.
- **What the worker adds to an optic for an MTF is read back, like the build** (`verify_field`, `probe_field`,
  `fft_step`): the one field, its type, angle, weight and vignetting factors, the normalised coordinate, the
  aiming, the stop radius the aimer takes, no apodization or polarization, the launch direction and the landing
  plane of the chief ray, and what the analysis says it computed with (`num_rays`, `grid_size`, wavelength, field,
  strategy, `remove_tilt`, the number and lengths of its curves). A difference is `build-mismatch`. A check added
  there needs a test that makes the mistake on purpose (`RealReadBackTest` in `test_mtf.py`).
- **A field optiland cannot compute is a row with a reason, never a number and never the request's failure**
  (`answer_field`): `optiland-raised-<class>`, `no-frequency-axis`, `frequency-beyond-axis` and
  `mtf-not-a-modulus` are `unavailable`, with NaN curves and the chief ray's landing still said; `not-converged`
  (a move above 0.005 on the axis, 0.01 off it, from the coarser step to the finer) and `convergence-unknown` are
  `unconverged`. `BuildMismatch`, `MemoryError` and `ImportError` are never a field's (`FATAL`). Each cut is
  interpolated linearly on optiland's own axis of that cut, and nothing beyond its last sample.
- **No polychromatic MTF is formed of optiland's moduli.** For the method "diffraction" a case of several lines
  is `unsupported` (`lines.polychromatic`) unless the engine option `line` names one; never average moduli. The 512 step is the
  engine option `fftRays` (256 or 512: the ladder is that and half of it): an option is in the result store's key
  and not in a request's id, so never add a sampling member to the `mtf.native` spec for it.
- **`mtf.native` of `optiland` by the method "geometric" is optiland's `GeometricMTF`, a line and a field a call**
  (`workers/python/lvrtc_optiland/geometric.py`): `distribution="uniform"`, `num_points=2048`, `max_freq` the
  largest frequency asked, `scale=False`, each read back with the factor the class multiplied by
  (`build-mismatch` otherwise). A keyword added to the call needs its read-back and a test that makes the mistake
  on purpose (`test_geometric.py`). Never ask the class without `scale=False`: its default multiplies in a
  diffraction limit. The ladder is 128 then 256 rays across the stop, 512 by the engine option `geometricRays`;
  only the option of the method asked is read (`fftRays` is the FFT's).
- **One line is optiland's own geometric curve; several lines are the worker's sum of optiland's landings**
  (`geometric.sum_curves`, the convention of `polychromaticOtf`: the case's weights, optiland's intensity as flux,
  the lines added as complex numbers before the modulus, about the axis point of the image plane, no bins).
  `method.name` says which: `geometric-mtf` or `spot-landings-sum`. Never form a spectrum's MTF of the lines'
  moduli, and never answer one line with the worker's sum.
- **optiland's bins are measured, not trusted.** The worker sums the landings optiland binned
  (`geometric.landing_sums`: `math.fsum`, no numpy, so the hermetic tier tests it) and gives optiland's value only
  within the field's band of that sum, 0.005 on the axis and 0.01 off it. Beyond it the field is `unavailable`
  (`frequency-beyond-bins`) at every frequency, as the contract requires of a field without curves.
  `binningMaxDelta` is stated for every field and gates nothing for several lines. A spot without rays is
  `no-rays`: optiland's class gives NaN and does not raise. A ray that ends at the last surface stays in
  optiland's spot without a landing, and the field is `optiland-raised-ValueError`: never remove a ray from
  optiland's spot (`docs/gotchas.md`).
- **`mtf.field_entry` and `mtf.judge_steps` are shared by both methods of `optiland`**, and a field is named by its
  fraction for either where the spec states fractions (`answer_mtf`). The answer of "diffraction" is held to a
  literal text, key by key (`DiffractionAsBeforeTest` in `test_geometric.py`); a change to either must leave that
  text the same. `MtfRequest` is built by keyword beyond its first four members.
- **The worker gives an MTF request up between two fields after `REQUEST_BUDGET_S`** (300 s), as the error
  `time-budget`, which the result store does not keep. `OPTILAND_TIMEOUTS` states only `helloMs`: the default run
  wait of ten minutes holds `mtf.native` (a field takes 0.2 to 2.9 s, a failing one 7 to 14 s, one failing 512
  step 45 s), and a killed worker is not restarted within a run. Ask few fields a request.
- **Expected values of the worker's MTF tests are derived in the test** (`test_mtf.py`): the lag of one ray and
  the f-number from the marginal ray in 60 digits (`exact.py`), the tangential lag off the axis from the two rim
  rays of the meridian, the chief ray's landing, the diffraction limit by counting the cells of the sampled disc,
  the labelling of the cuts by the spot of exact rays. Hermetic tests use a stand-in measure (`StandIn`) whose
  curves are binary fractions. A test that needs a quantity the optiland worker does not offer uses
  `selftest.echo` (`UNOFFERED_QUANTITY`), never `mtf.native`.
- **A quantity's version is negotiated** (`negotiate`): an engine that implements another version is
  `unsupported` without being asked. Raising a version changes together the schema, the corpus, CONTRACT.md's
  table and every engine that answers it (`lv`, `ref`, and `QUANTITIES` in `lvrtc_optiland/engine.py`).
  `system.describe` is version 2 (`innerClipRadius`); `paraxial.first-order` is version 1. `mtf.native` is version
  1 and is answered by `lv`, `replay`, `wave` and `optiland`.
- **optiland's first-order data is asked, not computed** (`lvrtc_optiland/first_order.py`). Every value is an
  accessor of `optic.paraxial` of the line's optic with only its reference changed: `F1()`, `P1()`, `EPL()` are
  from the first surface (add the first vertex); `F2()`, `P2()`, `XPL()` are from the image surface (add the
  image plane); the back focus is that rear focal point minus the vertex of the case's `lastLensSurfaceIndex`. A
  pupil's radius is half the magnitude of `EPD()` / `XPD()`, which are negative for an inverted pupil and are
  images of the system aperture's value (twice `conditions.stopSemiDiameter`), never of the stop surface's
  `r_max`. `FNO()` and, for a finite object, `magnification()` are recorded. Never call
  `updater.update_paraxial`. A NaN, the focal length's included, is `engine-failure`, never a value.
- **What an engine's paraxial model does not see is `unsupported`, never the focal length of another lens.** A
  term of power 1 is `surface.asphere.linear-term` in every engine; a term of power 2 is
  `surface.asphere.quadratic-term` in `lv` and `optiland`, whose kernels read the radius alone, and is answered
  by `ref` by the contract's rule. Both are decided from the case before anything is built or asked. optiland
  also answers `system.afocal` (`f2()` an infinity, or a power of at most 1e-12 of the sum of the surfaces'
  powers) and `system.telecentric.object-space` (`EPL()` or `EPD()` an infinity). A canary in
  `test/integration/lv/canaries.test.ts` fails when LV's aspheric schema gains a coefficient below `A3`.
- **Expected first-order values of the worker's tests are derived in the test** (`test_first_order.py`: closed
  forms and an exact `fractions.Fraction` trace), never taken from an engine's output. Synthetic cases come from
  `tests/optiland/support.py`; tier-3 helpers are in `test/integration/optiland/support.ts`.
- **`rays.trace` of `optiland` is optiland's own rows** (`lvrtc_optiland/trace.py`): the rays of a spec go into
  one `RealRays` bit for bit and through one `optic.surfaces.trace` of the spec's line's optic, the only one
  built. `hits`, exit and path are the rows of the case's surfaces; the landing and the path to it are optiland's
  image row. A request above `MAX_BATCH_RAYS` is traced in batches, in order. The rays of a request are one batch
  as given: optiland's tolerance on an asphere is the batch's (`docs/gotchas.md`); whether to shield a batch from
  its ended rays is the owner's open decision.
- **A ray optiland keeps is answered as optiland has it; why a ray ended needs evidence** (`trace.settle`). ok is
  optiland's own measure: intensity above 0 and a number for point, direction and path on every surface. An ended
  ray is `blocked` only where optiland's numbers show why (a point on its own sag with intensity 0; no direction
  where its Snell radicand is negative; a conic the line misses), and `failed` otherwise.
  `ON_SURFACE_TOLERANCE_MM` tells a hit from a point elsewhere and judges no precision: never tighten it to a
  gate.
- **optiland's optical path is its `opd`, corrected once** (`trace.path_lengths`): optiland's step is the line
  parameter along a direction it never normalises, so the worker adds `stretch x (|d| - 1)` per stretch, the
  excess computed exactly (`length_excess`). `verify_optic` reads back the index in front of every surface, since
  a path is charged to the medium between two surfaces. Tests are in `test_path.py`.
- **Expected values of the worker's ray tests are derived in the test** (closed forms, and `exact.py`, a
  60-digit trace written from the contract), never taken from an engine's output. A behaviour of
  optiland that `docs/gotchas.md` describes has a test that pins it.
- **No test requires a `FLOOR`**: a rung test holds gated pairs to PASS or FLOOR and to no failure (`assertR2`),
  and asserts what a floor's reason says only of the pairs that are floors, so a more accurate LV turns no test
  red.
- **An exception in an engine's `run` is a result** of status "error", code `engine-failure`, `ok: true`, in the
  Python kit as in `createProtocolHandler`. `ok: false` is for what the protocol could not handle, and for an
  engine that cannot describe itself.
- **Built-in engines (`ref`, `lv`, `replay`, `wave`, `optiland`) live in `src/engines/builtin.ts`** and run only where
  named: `--engines` or a suite's `engines`. The one exception is a rung that is about engines of its own
  (`RungDefinition.engines`): `r4f` is asked of `lv` and `replay`, and `r6b` of `lv` and `wave`, whatever
  `--engines` or a run names; `r5` and `r5g` are run only where they are named. `ref` is written from the optics alone; never port LV's or optiland's code into it. `lv`
  answers only from LV's own prepared state and re-exports every case (`stale-case`, `case-source`).
- **`ref` is the arbiter, and its proof is analytic.** Every claim of its tracer is held to a closed form derived
  in the test (`test/engines/ref/trace.test.ts`, `exact.test.ts`), never to another tracer's output. A sum that can
  cancel is compensated (`src/core/numeric/exact.ts`, shared with the estimators: in the adapter revision of every
  engine that reaches it, in no engine's fingerprint): the polynomial of a sag, an optical path. A ray is blocked
  only where the line was looked at: where Newton's method settles on no hit, the stretch inside the clear aperture
  is scanned for crossings (`crossingSteps`), and what cannot be decided is failed. When `lv` and `ref` differ,
  check the ray in extended precision before believing either; no gate is widened for it.
- **An estimator is a pure function of a trace** (`src/estimators`): no engine, no file, only IEEE 754 basic
  operations (no `Math.sin`, `Math.cos` or `Math.hypot`), every sum that can cancel compensated
  (`src/core/numeric/exact.ts`), so equal input gives equal bits. It imports nothing of an engine.
  `imageProjection.ts` is in the closures of `lv` and `ref`, and `geometricOtf.ts` in that of `replay` (an edit
  there moves an adapter revision: keep every operation bit for bit, or refresh the baselines); `waveOtf.ts`,
  `waveValidity.ts` and `src/rays/wavefront.ts` are in the closure of `wave` and of no other engine: keep them out
  of `lv`, `ref` and `replay`, whose adapter revisions the rays baselines hold. Its proof is analytic (`test/estimators`): closed forms with a derived quadrature
  bound, and whole-number arithmetic (`test/estimators/support.ts`: `exactTransfer`, `exactLength`), never an
  engine's output. The wave estimator's tests (`waveOtf.test.ts`) build spherical waves from their geometry: the
  staircase from whole-number pair counts, discs and the annulus in closed form, Hopkins' integral by a
  Gauss-Legendre rule written in the test, each bound derived beside its assertion; a lattice with pupil
  aberration holds the search to the closed forms.
- **A landing's distance is a length, whatever the length of the direction** (`projectToImagePlane`): the line
  parameter times `lengthOf(direction)`, formed without rounding and rounded once. Never charge a path by a line
  parameter. Which rays land is decided by the parameter, as LensVisualizer's `mtfImagePoint` decides it. A
  direction whose squares add up to exactly 1 gives the parameter in every bit; `test/integration/lv/rays.test.ts`
  holds every landing ray's path to the length worked out in whole numbers.
- **The geometric OTF has LensVisualizer's conventions and none of its code** (`src/estimators/geometricOtf.ts`):
  phase `-2 pi nu (u - u_ref)`, x the sagittal cut and y the tangential one, one reference point for every line of
  a spectrum, lines added as complex numbers by weight times flux before the modulus (`polychromaticOtf`). A source
  canary holds LV's lines (`canaries.test.ts`); a change there changes the estimator's note, its convention test
  and the canary. The modulus is not cut off at 1, and a frequency's value never depends on which others are
  asked. LV's reference is its chief ray traced with no aperture checked: a replay obtains it as LV does.
- **What an estimator cannot compute is an outcome with a reason, never a NaN and never a wrong number**
  (`OtfUnavailable`: `bad-frequency`, `no-reference`, `bad-landing`, `bad-weight`, `no-rays`, `no-flux`,
  `out-of-range`, `no-lines`, `bad-line-weight`, with the ray or line it is about). A ray more than
  `MAX_PHASE_CYCLES` (2^32) cycles of phase from the reference is `out-of-range` and named: the phase is reduced
  exactly only below that, so never raise it without a test against the whole-number definition. A spectrum with a
  line that has no valid ray or no flux is unavailable as a whole and names the line: a line is never dropped.
  Arrays of unequal length throw. A ray of weight 0 adds nothing, but must have landed if it is taken.
  `WaveOtfUnavailable` has the same reasons except `bad-landing`, and `bad-line`, `bad-ray` and `degenerate-pupil`
  (lit cells on one line of the lattice, or a map from cells to cosines that folds or collapses at a cell).
- **Identical-ray estimators run on the rays valid in every engine** (`src/estimators/validity.ts`):
  `intersectValidity` of each answer's `maskWhere(status, RAY_STATUS.ok)`, handed to the estimator as
  `spots.valid`. Never apply an estimator to a bundle cut by one engine's status alone.
- **The benchmark is 96 runs: 12 configurations in four conditions** (`suites/benchmark.json`). The 24 runs of
  the lenses as they open come first and are never reordered; then, per configuration, `-best-`, `-f8-` and
  `-f8-best-` on both sets of lines. f/8 is `aperture: { kind: "lv-f8-comparison" }`, the stop of the MTF tab's
  own comparison (`lvHookStop`, `lvTabComparison`, with canaries), never `{ kind: "f-number", value: 8 }`, which
  is the hook's slider and not the same double on every lens. A test that means "the 12 configurations" filters
  with `asItOpens` (`test/suites/support.ts`); the optiland rung tests run those 24 (`rungSuite`), and
  `baseline.test.ts` all 96.
- **`lv-best-axial` is asked of LensVisualizer, never computed** (`lvBestAxialFocus`, `src/engines/lv/focus.ts`):
  the first step of `computeMtfSteps` for the stop, the lines and the grid cap of the run. The case is exported at
  `state.imgZ` plus that shift and is then a case like any other. The plane is of one stop, one spectrum and one
  cap. `lv` answers `mtf.native` about a case off its design plane only when its own search, asked again for the
  request, gives that plane to the bit; it then asks LV for `best-axial` and states
  `{ mode: "design", appliedShiftMm: 0 }`.
- **The MTF recipe comes from the case source, like the ray sets** (`CaseSource.recipe`; `src/core/mtfRecipe.ts`,
  `src/engines/lv/recipe.ts`). A rung made from it says `needsRecipe` and reads `RungInputs.recipe`, never an
  engine or a lens; the manifest records it under `runs[].recipe`. A case file states its fields as angles or has
  none (`recipe-needs-field-angles`). It is no contract kind: a request states what it needs of it in its own spec.
- **`replay` is LensVisualizer's rays and the comparator's sums** (`src/engines/lv/replay.ts`, `replayEngine.ts`).
  It calls what LV exports (the first step of `computeMtfSteps`, `prepareMtfFieldLaunch`, `findMtfFieldFootprint`,
  `traceMtfBundle`, `expandMtfFootprint`, `refineMtfField`, `emptyMtfField`, `assessUnresolvedFlux`, the
  constants) and restates only `traceField`'s loop, `fieldAtGrid`'s bookkeeping and the ladder, each line with a
  canary. Never call or port LV's `geometricOtf` or `combineOtfs` there: the sum is `polychromaticOtf`. The sums
  that decide which grids are traced (flux, unresolved share) stay LV's plain ones. Its request is `lvMtfRequest`,
  the one function `lv` builds its own with: never build a second. The stand-in of
  `test/engines/lv/replay.test.ts` holds each line of the bookkeeping to a closed form: removing one must turn a
  test red.
- **A rung may be about engines of its own** (`RungDefinition.engines`): `r4f` is asked of `lv` and `replay`
  whatever `--engines` or a run names, and of no case without a recipe LensVisualizer resolved. A comparison adds
  no run reference to such a rung, and `baseline check` names an engine that only such a rung has for no other
  rung (`runEngines`). A hermetic test whose registry knows neither engine names its rungs.
- **R4f is gated on three figures (policy version 6)**: `mtf.maxAbs` <= 1e-9, pinned at Stage 3.2 on a measured
  maximum of 1.25e-14; `sampling.mismatches` and `fields.mismatches` at 0; no floor. A grid size, a ray count or a
  status that differs is a defect of the replay or a change in LV: read the canaries, never widen. R4f is in the MTF baselines.
- **R4 is the geometric MTF of the run's ray sets** (`src/compare/raysMtf.ts`): the rays are the sets R2 and R3
  judge (`rayTraceRequests`), never the grid a field's refinement ends at, which is R4f's; the landing is each
  engine's own `imagePoint` on the plane of the run's case, which is the recipe's plane (a recipe of another plane
  is not comparable; nothing is projected a second time); a ray counts by its weight in the request and a line by
  its weight in the case; the frequencies are the recipe's, so a run without a recipe is not asked. The reference
  point is midway between the two engines' flux-weighted centroids of the first line's rays, never a chief ray's
  landing.
- **In R4 "valid in every engine" is of the two engines of a pair**: a ray that is ok in one answer and not in the
  other is left out of both sums and counted (`rays.dropped`); it is R2's to judge, never R4's. `no-rays` and
  `no-flux` are "not measured", which is a pass: a tier-3 test of R4 asserts the figure was measured. Any other
  reason the estimator has no value is not comparable.
- **A figure of several requests is a span** (`QuantityComparator.spanOf`, `src/compare/span.ts`):
  `compareManifest` puts the groups of a rung together by the comparator's span key, the set stands under the
  `requestId` of its first request, and each participant is a `SpanAnswer`; an engine without an ok answer to one
  request of a span enters as that request left it. `comparePair`, `compareGroup` and the floor rule know nothing
  of spans; a baseline's `requests` counts sets. A comparator of spans takes its members in an order of its own
  (R4: by line), never the order handed over.
- **R4 has no floor, and its gate is tighter than R2's**: a landing within R2's 1e-8 mm may turn a term by 6e-6
  at 100 cycles/mm. A FAIL of R4 is attributed with R2's figures for the same ray sets before anything is
  concluded; whether R4 gets a floor is the owner's.
- **The wave OTF is Hopkins' autocorrelation in cosine space, from optical paths** (`src/estimators/waveOtf.ts`):
  the pupil coordinate is index times direction cosine at the image side and the shear `lambda nu`, wherever the
  exit pupil is; a cell's path is `launch + path + n d . (R - Q)`, the path to the foot of the perpendicular from
  the reference point, so a late ray has the larger W and the phase has the geometric estimator's sign; the
  modulus is `sqrt(flux / area)`, the area being the Jacobian of cells to cosines; no obliquity factor. Each lit
  cell is the lower and the upper end of a pair, so the value at `-nu` is the conjugate bit for bit. The phasors
  are `spotSums`'s, unchanged.
- **A sheared point is located by patch, never by a search across the lattice** (`locatePatches`, `shearedPoint`):
  only the patches with a lit corner exist, binned by where they lie in cosine space, and the point is solved in
  its own patch's bilinear map, in both coordinates, with the interpolation its path is read with (which keeps a
  tilt out of the modulus). Never shear along a row of the lattice, and never read the cosines of a dark cell that
  is not beside a lit one: the lattice says nothing of them, and a search that crossed them lost pairs without a
  flag.
- **The wave estimator reads a `rays.trace` request and answer and nothing else** (`TracedLattice`): the request's
  weights, `imagePoint` with `opticalPathToImage` (or `exitPoint` with `opticalPath`), `exitDirection`, the mask of
  the rays valid in every engine, the line's wavelength and image-space index, and
  `launchPaths(origins, directions, conditions.object)`, since a ray's `opticalPath` starts at its own origin. Ray
  `row * columns + column` is the cell (`groups.lattice`); what follows the cells, the chief ray, is not looked
  at. It needs no chief ray and no lattice step.
- **The rim of a lattice is a staircase, and `undersampled` is a fact about a lattice** (`waveOtf.ts`): on an even
  lattice the estimate is the autocorrelation of the lit cells to a rounding, and against the true aperture it is
  of first order in the cell (`3 e / (1 - e)`); never claim more of it. `phaseStep` above `QUARTER_WAVE` between
  neighbouring lit cells sets `undersampled`: such an estimate is no arbiter, though it still compares two
  engines' traces of the same rays. The step includes the tilt of the reference: keep the reference amid the spot.
  `gridConvergence` is the figure of two lattices.
- **`npm run format` does not cover `docs/`**: never run prettier on a Markdown file there; it realigns every
  table.
- **`wave` is LensVisualizer's rays and the comparator's wave estimator** (`src/engines/lv/waveEngine.ts`). It
  answers `mtf.native` for the method diffraction on the plane of the case: the run's own ray sets of a field
  (`lvFieldRaySets`, which `lvRaySets` loops over; never build a second generator) at `bundleGrid` cells and at
  twice as many, traced by `answerLvRays`, about the flux centroid of the first line. A field is `ok` only where
  `waveFlags` is empty, else `unconverged` with the flags joined by `+`. Its `gridSize` is the cells asked for, as
  LV states its own, never the lattice's columns.
- **The finer lattice comes from the case source asked with `fineSampling`** (`src/rays/raySets.ts`,
  `FINE_GRID_FACTOR` 2). A rung that says `needsFineRaySets` is handed `RungInputs.fineRaySets`, and the manifest
  records them under `runs[].fineRaySets`. Only `r6a` asks them: never hand them to R2, R3 or R4, whose baselines
  are of the run's own sets.
- **R6a is the wave MTF of the run's ray sets on two lattices** (`src/compare/raysWaveMtf.ts`). A field's sets on
  both lattices at every line are one span; the finest lattice is judged and the next coarser gives
  `convergence.maxAbs`. Rays, weights, plane and reference point (midway between the two engines' flux centroids,
  per lattice) are R4's. Frequencies are `waveFrequencies(recipe)`, at most eleven. The comparator keeps an outcome
  by the identity of the two answers and the context (`MEASURED`): never key it by anything else.
- **A lattice is an arbiter or its field is not judged** (`waveFlags`, `src/estimators/waveValidity.ts`):
  `phaseStep` within `QUARTER_WAVE` and a move on doubling within `CONVERGENCE_BANDS` (0.005 on the axis, 0.01 off
  it). A flagged field reports `waveMtf.flagged`, lists `waveMtf.maxAbs` as unmeasured with the fact that flagged
  it, passes, and is in no pin. Never raise `QUARTER_WAVE` or a band, and never judge a flagged field, to cover a
  lens; a tier-3 test of R6a asserts that fields were judged.
- **R6a counts judged fields, not PASS pairs**: a flagged field is PASS; `waveMtf.maxAbs.measured` is the count
  (benchmark 208 of 288). A metric's `measured` is the number of requests whose pair has the metric, never the
  requests of the rung; a test holds the two apart (`test/baseline/mtf.test.ts`).
- **R6a is gated at 4e-5 (policy version 8), pinned at Stage 3.5** at ten times LensVisualizer's 3.12e-6 over the
  208 judged fields of the benchmark, and measured again at Stage 3.8; the exact tracers agree to 1.15e-9, and a
  pair of `ref` and optiland above a thousandth of the gate is a defect (`r6a.test.ts` holds it). No floor;
  whether it gets one is the owner's. The pin is of LensVisualizer's rounding: pin it again from a measurement
  when LensVisualizer's intersection tolerance changes.
- **R6b is recorded, never gated** (`src/compare/mtfWave.ts`): `mtfOnAxis.maxAbs` in a band of 0.005 and
  `mtfOffAxis.maxAbs` of 0.01, over the fields both answers stand by; a field an answer calls unconverged goes to
  `mtfFlagged.maxAbs`, in no band. A row near its band at f/8 is LensVisualizer's grid of 32 cells against the
  estimator's 64, not a method error (`docs/gotchas.md`).
- **`r5` is recorded, of three engines, and run only where it is named** (`r5Rung`, `onlyWhereNamed`): it asks
  R6b's one request of `lv`, `optiland` and `wave`, and optiland is handed the recipe's angles as its option
  `fieldAnglesDeg` (`recipeAngles`, matched by fraction, never by place); never a second request by angles. A
  photopic run has no optiland row (`lines.polychromatic`): never ask optiland line by line before Stage 4.3.
- **A field of R5 is sorted before any difference is taken** (`classifyNativeField`, `src/compare/mtfNative.ts`):
  unsupported, data, numerical, method, in that order, and only `two-methods` enters a band. The report repeats
  the sorting from the recorded values (`factsOfRecorded`), so a fact the sorting reads must be recorded: change
  `factsOfField`, `factsOfRecorded` and `recorded` together. `chiefLanding.maxAbs` is the limit of the sorting and
  lives in the policy; the comparator reads it from `ComparisonContext.policy` and is not comparable without it.
  `rim-rays-lost` is `rimRaysLost` above 0 and nothing else: never set a field aside by `rimRaysLit` or
  `rimLandingSpreadMm` without a measured limit.
- **A follow-up is a second job of one engine, decided from stored answers** (`FollowUp`,
  `src/core/orchestrator.ts`; `followUpsOf(policy)`, `src/compare/followUp.ts`): `ManifestJob.step` names it, it
  has the request id of the first job and a store entry of its own, it follows the rung's other jobs of the run,
  and in a comparison it is its engine's later answer (`ParticipantResult.steps`, `ComparisonContext.steps`),
  never a participant; its recorded values are `<name>#<step>`. A pair is judged by the last step and writes the
  first beside it (`*.firstStepMaxAbs`). `lvrtc run` and `baseline check` pass `followUpsOf` of the policy they
  judge by. The finer step is `fft512` for `r5` and `geo512` (`geometricRays: 512`) for `r5g`, the latter only of
  an answer of one line: a marked field on several lines is judged by its first answer.
- **`r5g` is `r5` on the geometric MTF, by a parameter** (`nativeMtfComparator(rung)` in
  `src/compare/mtfNative.ts`; `kind` in `src/report/mtfComparison.ts`): one comparator, one sorting of a field,
  one table, one wording and lint for both rungs. Its engines are `lv`, `optiland` and `replay`; it is run only
  where named. Never copy R5's machinery for it: a change to a class, a status or a sentence is a change to both,
  and to both golden files (`r5-stand-ins`, `r5g-stand-ins`).
- **`r5g` asks one request a field** (`geometricFieldMtfSpecs`), never R4f's request: optiland's geometric MTF of
  a fast lens wide open takes minutes at full field (`docs/gotchas.md`), and a worker silent for ten minutes is
  ended and not restarted within a run. A rung is asked for the options of each of its requests
  (`RungDefinition.engineOptions`, fourth argument); optiland is handed that request's angle as `fieldAnglesDeg`.
- **The chief-landing limit is a limit of sorting, per rung, and is no gate**: 1e-7 mm for `r5`, 1e-3 mm for `r5g`
  (awaiting the owner), because the modulus of a geometric MTF does not depend on its reference point and on
  several lines LV's chief ray is one launch, solved without a wavelength, traced at every line. Never read
  `imageHeightMm` of two engines on several lines as the landing of one ray.
- **On several lines optiland's column in R5g is the worker's sum of optiland's own landings**; the report says so
  under such a table (`GEOMETRIC_SEVERAL_LINES`), decided from the number of lines the answer records, and a test
  holds that only such a table carries the sentence.
- **Every sentence a report writes about a recorded comparison is a template of `src/report/wording.ts`**, and
  `wordingProblems` lints every golden report (`test/report/wording.test.ts`): a new sentence goes into that file,
  a new banned claim needs its rejected and its accepted examples in the test. `NOT_COVERED` is rendered in every
  report and says only what the measurement supports; change it only with the plan.
- **MTF baselines are files of their own** (`baselines/<suite>.mtf.json`, `reports/<suite>/mtf.{md,json}`;
  `--mtf` on `baseline write` and `check`; `verify` holds both kinds). `buildBaseline` with `MTF_BASELINE`: the
  rungs r4, r4f, r5, r5g, r6a, r6b of the run, each metric with `measured`, a rung's `steps`, `bands` and, for r5
  and r5g, `sets`. The benchmark's holds all six, the feature suite's the three gated (run it with
  `--rungs r4,r4f,r6a`). The rays baseline, its report and its check stay as they are; R4 is in both. The MTF
  report is rendered from the baseline alone (`src/baseline/mtfReport.ts`) and ends with the fixed Not covered
  block; its wording is linted.
- **Contract minor 1 is stated only by a document that uses it** (`CONTRACT_VERSION_1_1`: a baseline with
  `measured`, `steps`, `bands` or `sets`). Every case, request, result, manifest, comparison and rays baseline is
  written as `CONTRACT_VERSION` 1.0; never raise that constant, since it is in every identity.
- **A run directory is of the last run of its suite.** The rays rungs and the MTF rungs are run, compared and
  written one after the other: write a baseline directly after its own check. `baseline write` refuses a run that
  lacks a rung the baseline at hand has, unless `--replace`.
- **`MOVED` is the `DRIFT` of a recorded rung and fails nothing** (a verdict changed, or a figure moved by more
  than its attention band); `baseline check` also lists every figure that is not what the baseline has
  (`summarizeChanges`), and does not compare the per-field values kept in `sets`: read `git diff reports/` after a
  rewrite. A recorded pair that is ERROR today fails the check.
- **An edit to a file in a built-in engine's import closure (`src/contract/version.ts`, `src/core/suite.ts`, ...)
  changes its adapter revision**: all four baselines become STALE(engine) and the store recomputes lv, ref, replay
  and wave. Check, then write, each kind.
- **`lvrtc mtf --profile benchmark` is a suite of its own** (`mtf-<lensKey>`, `runBenchmark` in
  `src/cli/commands/mtf.ts`, `loadSuiteValue`): the conditions and cases are the benchmark suite's, so the store
  answers a benchmark lens; r5 and r5g only where optiland is named; it exits 1 on a FAIL or ERROR pair. Without
  `--profile benchmark` the command is the single request of `lv-tab-default`. A test of it sets `LVRTC_RUNS_DIR`
  and closes the binding.
- **An edit of CLAUDE.md by a script is checked**: a replacement whose text is not found must stop the command
  that follows it, and what was written is read back before a commit says it was.
- **A gate is never loosened to make a lens pass.** Classify the lens in `docs/gotchas.md`. A gate changes only on
  a measured numerical floor, recorded under "Amendments since approval" in the plan and by raising the policy's
  `version`.
- **Tests that need the real LV** are `test/integration/lv/**/*.test.ts`, run by `npm run test:lv` and excluded
  from `npm test`. Each skips with a reason when LV is missing (`LV_UNAVAILABLE` in
  `test/integration/lv/support.ts`), writes nothing into the repository or LV, and names the LV commit of every
  number it pins. Hermetic binding tests use the fake tree `test/fixtures/fake-lv-binding`, copied to a temporary
  directory per test (`freshLv`), and close the binding they open: the loader serves one LV tree at a time.
- **Nothing LV-derived that reproduces a prescription is committed**: only result numbers, hashes, counts and
  lens keys. `lvrtc lenses show` is console output.
- **`test/fixtures/` is data, not source**: excluded from `tsc`, eslint and prettier. Tests load fixture modules
  from a temporary copy, because Node caches modules by URL.
- **The Python worker kit is stdlib-only** (`workers/python/lvrtc_worker_kit`, Python `>=3.10`, type hints, 120
  columns) and writes nothing to disk; numpy is used only inside the optiland worker. Nothing is installed into the
  optiland environment. Its tests are `unittest` in `workers/python/tests/kit`. `lvrtc_optiland` imports the
  standard library, the kit, numpy and optiland, and importing the package itself imports none of the last two.
- **`validate.py` is a port of `src/contract/validate.ts`, and `ndarray.py` of the array codec.** Change both
  sides together; the fixture corpus in `contract/fixtures` holds them to the same answers. Workers echo ids and
  never recompute a hash.
- **A test that needs `python3` skips with a stated reason when it is missing** (`PYTHON_MISSING` in
  `test/engines/support.ts`). The stdio transport itself is tested against Node workers in
  `test/fixtures/stdio-worker`, so those tests need no Python.
- **A test that runs `lvrtc run`, `compare` or `report` sets `LVRTC_RUNS_DIR` to a temporary directory**; nothing
  a test writes goes into the repository. `test/fixtures/fake-root` defines `fake-py` and `fake-pyn`, Python
  workers: name in-process engines (`--engines fake-a,fake-b,fake-none`) in a test that must run without Python.
  `test/fixtures/fault-root` holds the engines that fail.
- **Every rung has an entry in `policy/rungs.v1.json` and a comparator of its quantity in `src/compare`**; a
  test holds the three together. `mtf.native` has a comparator for each of `r4f` (`src/compare/mtfFidelity.ts`),
  `r5` and `r5g` (`mtfNative.ts`) and `r6b` (`mtfWave.ts`); `r5` and `r6b` ask one request, so an answer is
  computed once. No quantity is without a comparator today, and the test says so. Raise the policy's `version` when a rung, a class
  or a limit changes. Four rungs compare `rays.trace`, each with a comparator that names its rung: `r2`
  (geometry and mask), `r3` (optical path), `r4` (geometric MTF) and `r6a` (wave MTF) all ask the `rays.trace` requests of
  `rayTraceRequests`, so an engine traces a set once.
- **A comparator is given the request's spec and the run's case** (`ComparisonContext`) and says "not comparable"
  when it needs one that is missing; it never guesses. A metric it cannot measure on two answers goes under
  `unmeasured`, is not judged, and is named in the pair's reason.
- **`FLOOR` is a pass, counted apart, and its limits live in the policy** (`floor` on a rung and on its metrics;
  `src/compare/floor.ts`; policy version 10). A pair of `lv` above a gate is FLOOR when `lv` is within the floor
  limit of the arbiter `ref`. Every other engine is a witness: within `agreement` of `ref` it corroborates; beyond
  it the pair is still FLOOR and the reason says the witness did not corroborate. A floor is refused (FAIL) when
  the witness sides with `lv` against `ref` (arbiter-suspect), or when in the `lv`-witness pair the witness is as
  far from `ref` as `lv` is. A metric without floor limits (the mask) always fails. Never add a floor limit, or
  widen one, to make a lens pass.
- **In R1 a pupil is judged on the scale of its distance from the image plane, in position and in radius**
  (`pupilZ.maxScaled`, `pupilRadius.maxScaled`; `PUPIL_RADII` in `src/compare/paraxialFirstOrder.ts` pairs each
  radius with the position of its own pupil). The six values that are no pupil's keep the plain 1e-9 mm, and so
  does a pupil within a metre of the image plane. A distance that is no finite number scales nothing.
- **A metric that is shown and not judged is named after what it is a figure of**: `<subject>.maxAbs` beside the
  judged `<subject>.maxScaled`. A report puts it in the column after the judged one (`subjectOf`,
  `src/report/model.ts`).
- **Rays come from the case source, never from a rung or an engine.** `CaseSource.raySets` makes the ray sets of a
  run (`src/engines/lv/raySets.ts` for an LV lens, `src/rays/probe.ts` for a case file); a rung's request builder
  only wraps the sets it is handed (`RungInputs`). A set must be the same bytes whenever it is generated: its
  hash is in the request id. A field without rays is a coded problem of that field and fails nothing.
- **One seed for LV's footprint scan, the MTF tab's** (`lvPupilSeed`): the ray sets and the product MTF both ask
  with it, so the rays of a set are the tab's own launch rays for a case that is the tab's.
- **LV's launch rays are kept verbatim**: every lattice cell as its own ray, no mirroring, no normalising (a `-0`
  stays), the chief ray last at weight 0. What `traceMtfBundle` and `computeMtfSteps` do inline is restated in
  `raySets.ts` and held to LV by source canaries and by a bit-for-bit comparison with LV's own bundle.
- **A sequential trace follows the order of the case, not of z**: a surface behind the last hit is met by a step
  backwards (LV fails there with `noBracket`); a ray that no longer travels toward +z is blocked at the next
  surface. Every engine writes its answer through `src/rays/traceRecorder.ts`.
- **In `rays.trace` every value of a ray that did not arrive is NaN from the surface where it ended**, that
  surface's hit included; `endSurface` is S for a ray that passed every surface and cannot reach the image plane.
  A trace that ends on the last surface is landed by `src/estimators/imageProjection.ts`, for every engine alike.
- **`fingerprint` is the engine's own code; `adapterRevision` is the comparator's code behind a built-in engine**
  (`src/engines/adapterRevision.ts`: the import closure of the engine's module, values only). The result store
  keys by both. A new built-in engine states both; never fold adapter code into a fingerprint.
- **`mtf.native` of `lv` is LV's product MTF asked as LV's MTF tab asks** (`src/engines/lv/mtf.ts`). The tab and
  its hook are React and cannot be imported: `src/engines/lv/tabRequest.ts` restates them expression by expression,
  in their order of operations, on the functions and defaults they read, which the binding imports. Never
  simplify an expression there (`(w * F) / F` is not `w` in doubles), never hard-code a default of the tab, and
  never take the seed from `L.EP` as LV's audit scripts do. Every restated line has a source canary; a change to
  the tab's request changes `tabRequest.ts`, its canary and the request spelled out again in
  `test/integration/lv/mtf.test.ts`, three places that share no line.
- **A profile is checked, not trusted.** The spec of `lv-tab-default` states the tab's frequencies, fields, method
  and focus, and the case has the tab's stop radius and lines (`src/engines/lv/tabProfile.ts` builds both); `lv`
  rebuilds the request from the case and answers `bad-spec` for anything else. What LV's MTF cannot compute is
  `unsupported` with a named item, LV's own gate first and with LV's reason. A limit of LV on a request (how many
  fields or frequencies) is asked of its gate, never restated: `invalid-input` from LV is an engine failure only
  for what the engine itself put into the request.
- **`lvrtc mtf` writes `<runsDir>/mtf/<profile>/<run>/mtf.json`** (`src/core/mtfRun.ts`): codes, hashes and answers,
  no time, no path, and of a failed engine only the code. A test that runs it sets `LVRTC_RUNS_DIR`, and a test
  that runs it in this process on a second fake tree closes the binding of the first (`closeBinding`).
- **Pinned MTF figures are compared only while LV's engine closure and the case are the ones they were measured
  with** (`PINNED_CLOSURE`, `PINNED` in `test/integration/lv/mtf.test.ts`): a lens edit must not turn `test:lv`
  red. A name added to the import manifest changes the closure: measure and pin again. R4f's pins are
  `PINNED_CLOSURE` and `PINNED` in `test/integration/lv/fidelity.test.ts` (grid sizes of the 24 opening runs),
  under the same condition.
- **The fake LV tree (`test/fixtures/fake-lv-binding`) has a tracer, an MTF launch, a product MTF and tab
  defaults of its own**, with LV's names; its defaults are deliberately not LV's. A name added to the import
  manifest needs a fake of it there, and a new fake file a line in `FAKE_ENGINE_FILES`
  (`test/engines/lv/support.ts`). `variantOf` rewrites a file of a copy for one test. A lens stating
  `mtf: { sampled: true }` has its geometric MTF sampled grid by grid (ladder, tolerance, widening and plain sums
  of the fake's own; `footprintScale` makes its scan too small); every other lens keeps the closed form, and is a
  FAIL in R4f by design. A test that removes a module to break a binding removes `src/optics/layout.ts`, which
  nothing else imports; a test binding an edited tree through a case source edits the fresh tree in place, since
  a `variantOf` copy is closed only by `bind`.
- **Baselines are the committed record** (`baselines/<suite>.json`, contract kind `baseline`): for every run as
  run (name and case hash), rung and pair of engines, the verdict, metrics, counts, policy, fingerprints and
  adapter revisions; no ray arrays, no prescriptions. `reports/<suite>/rays.{md,json}` are rendered from the
  baseline alone. `lvrtc baseline write <suite>` writes both from a compared run and refuses a run with a FAIL or
  ERROR pair. `lvrtc baseline check <suite>` needs the engines: per record OK, STALE(case|engine|policy) with
  REFRESHABLE or DRIFT, NEW or GONE; it exits 1 only on DRIFT, FAIL or ERROR. `lvrtc verify` is hermetic and the
  last step of `npm run check`: schema, invariants, policy hash, and reports byte for byte; it cannot see STALE.
  The rays baselines hold R0 to R4: a policy change therefore needs them rewritten with
  `--rungs r0,r1,r2,r3,r4`, and the MTF baselines with theirs, which needs LV and optiland. `report --floor`
  remains a local tool. A rays baseline states contract 1.0; an MTF baseline 1.1.
- **Reports are golden-tested** against `test/fixtures/golden`. A change that is meant to change a report rewrites
  them with `node test/report/writeGolden.ts` (also `test/fixtures/golden/*.mtf.md`, the MTF reports of the R5 and
  R5g stand-ins); read the diff. `comparePair`, `compareGroup`, `buildReport` and `renderMarkdown` are pure
  functions and stay so. The goldens include `r5-stand-ins.report.md` and `r5g-stand-ins`, written by the same
  command from `test/report/r5Fixture.ts` (stand-in engines named `lv`, `optiland`, `wave`, a policy of
  binary-fraction bands).
- **Reports and baselines are deterministic**: no timestamps, no machine information.
- **Recorded differences are not errors.** Only direct and identical-ray rungs are gated; see the ladder in the
  plan before adding a tolerance.
- Formatting follows LV: double quotes, 120 columns.
