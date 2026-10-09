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
node bin/lvrtc.mjs run suites/benchmark.json   # the suite's own engines (lv, ref) on every rung; selftest is unsupported by both; r4f adds lv and replay
node bin/lvrtc.mjs run suites/benchmark.json --rungs r4f   # R4f: lv against the replay of its own MTF sampling, 96 runs (about 3 min); asked of lv and replay whatever --engines names
node bin/lvrtc.mjs engine conformance replay   # the conformance kit on the replay engine (needs LV)
node bin/lvrtc.mjs compare benchmark           # judge that run: exit 1 on FAIL or ERROR; FLOOR is a pass
node bin/lvrtc.mjs engine conformance ref      # the conformance kit on a built-in engine
node bin/lvrtc.mjs baseline write benchmark    # after run and compare: writes baselines/benchmark.json and reports/benchmark/rays.*
node bin/lvrtc.mjs baseline check benchmark    # needs the engines: OK, STALE, REFRESHABLE or DRIFT per record
node bin/lvrtc.mjs verify                      # hermetic: baselines valid, committed reports byte-identical; part of check
node bin/lvrtc.mjs engine conformance optiland # the same on optiland: starts the Python worker (about 3 s; 17 s on an empty cache)
node bin/lvrtc.mjs run suites/benchmark.json --engines lv,ref,optiland --rungs r0,r1,r2,r3,r4   # three ways: built system, first-order data, LV's launch rays, optical path, geometric MTF; what the baselines are of
node bin/lvrtc.mjs mtf nikkor-z50f12           # the MTF LV's own tab presents; --aperture f/8 for its comparison
node bin/lvrtc.mjs mtf nikon-z-24-70f4s        # a zoom: both ends, two tables; --zoom 1 for the tele end alone
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
- **A quantity's version is negotiated** (`negotiate`): an engine that implements another version is
  `unsupported` without being asked. Raising a version changes together the schema, the corpus, CONTRACT.md's
  table and every engine that answers it (`lv`, `ref`, and `QUANTITIES` in `lvrtc_optiland/engine.py`).
  `system.describe` is version 2 (`innerClipRadius`); `paraxial.first-order` is version 1.
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
- **Built-in engines (`ref`, `lv`, `replay`, `optiland`) live in `src/engines/builtin.ts`** and run only where
  named: `--engines` or a suite's `engines`. The one exception is a rung that is about engines of its own
  (`RungDefinition.engines`): `r4f` is asked of `lv` and `replay` whatever `--engines` or a run names. `ref` is written from the optics alone; never port LV's or optiland's code into it. `lv`
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
  there moves an adapter revision: keep every operation bit for bit, or refresh the baselines); `validity.ts` and
  `waveOtf.ts` are in no engine's closure and must stay out. Its proof is analytic (`test/estimators`): closed forms with a derived quadrature
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
  status that differs is a defect of the replay or a change in LV: read the canaries, never widen. R4f is in no
  committed baseline until Stage 3.8.
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
  test holds the three together. `mtf.native` has a comparator for `r4f` only (`src/compare/mtfFidelity.ts`); the rung
  that sets two independent engines' MTF against each other brings its own. No quantity is without a comparator
  today, and the test says so. Raise the policy's `version` when a rung, a class
  or a limit changes. Three rungs compare `rays.trace`, each with a comparator that names its rung: `r2`
  (geometry and mask), `r3` (optical path) and `r4` (geometric MTF) all ask the `rays.trace` requests of
  `rayTraceRequests`, so an engine traces a set once.
- **A comparator is given the request's spec and the run's case** (`ComparisonContext`) and says "not comparable"
  when it needs one that is missing; it never guesses. A metric it cannot measure on two answers goes under
  `unmeasured`, is not judged, and is named in the pair's reason.
- **`FLOOR` is a pass, counted apart, and its limits live in the policy** (`floor` on a rung and on its metrics;
  `src/compare/floor.ts`; policy version 7). A pair of `lv` above a gate is FLOOR when `lv` is within the floor
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
  The baselines hold R0 to R4 (R4f not until Stage 3.8): a policy change therefore needs them rewritten with
  `--rungs r0,r1,r2,r3,r4`, which needs LV and optiland. `report --floor` remains
  a local tool. The contract stays at 1.0.
- **Reports are golden-tested** against `test/fixtures/golden`. A change that is meant to change a report rewrites
  them with `node test/report/writeGolden.ts`; read the diff. `comparePair`, `compareGroup`, `buildReport` and
  `renderMarkdown` are pure functions and stay so.
- **Reports and baselines are deterministic**: no timestamps, no machine information.
- **Recorded differences are not errors.** Only direct and identical-ray rungs are gated; see the ladder in the
  plan before adding a tolerance.
- Formatting follows LV: double quotes, 120 columns.
