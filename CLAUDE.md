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
npm run test:optiland  # tests against the real optiland (test/integration/optiland); NOT part of check; the suites, focus stations and catalog sweep need LV too
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
node bin/lvrtc.mjs run suites/benchmark.json --engines lv,ref --rungs r0,r1,r2,r3   # with LV's own launch rays traced
node bin/lvrtc.mjs run suites/benchmark.json   # the suite's own engines (lv, ref) on every rung; selftest is unsupported by both
node bin/lvrtc.mjs compare benchmark           # judge that run: exit 1 on FAIL or ERROR; FLOOR is a pass
node bin/lvrtc.mjs report benchmark --floor reports/benchmark   # after the two above: rewrites lv-floor.{json,md}
node bin/lvrtc.mjs engine conformance ref      # the conformance kit on a built-in engine
node bin/lvrtc.mjs engine conformance optiland # the same on optiland: starts the Python worker (about 3 s; 17 s on an empty cache)
node bin/lvrtc.mjs run suites/benchmark.json --engines lv,ref,optiland --rungs r0,r1   # R0 and R1 three ways: optiland builds every case, reads it back and gives its own first-order data
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
  float64: never switch either.
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
  geometries, materials or apertures. A test that needs the real optiland skips with `real_optiland_missing()`.
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
- **An exception in an engine's `run` is a result** of status "error", code `engine-failure`, `ok: true`, in the
  Python kit as in `createProtocolHandler`. `ok: false` is for what the protocol could not handle, and for an
  engine that cannot describe itself.
- **Built-in engines (`ref`, `lv`) live in `src/engines/builtin.ts`** and run only where named: `--engines` or a
  suite's `engines`. `ref` is written from the optics alone; never port LV's or optiland's code into it. `lv`
  answers only from LV's own prepared state and re-exports every case (`stale-case`, `case-source`).
- **`ref` is the arbiter, and its proof is analytic.** Every claim of its tracer is held to a closed form derived
  in the test (`test/engines/ref/trace.test.ts`, `exact.test.ts`), never to another tracer's output. A sum that can
  cancel is compensated (`src/engines/ref/exact.ts`): the polynomial of a sag, an optical path. A ray is blocked
  only where the line was looked at: where Newton's method settles on no hit, the stretch inside the clear aperture
  is scanned for crossings (`crossingSteps`), and what cannot be decided is failed. When `lv` and `ref` differ,
  check the ray in extended precision before believing either; no gate is widened for it.
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
  test holds the three together. A quantity no rung asks for has no comparator, and the test names each: today
  `mtf.native`, which is presented (`lvrtc mtf`) and not yet compared. The rung that compares it brings its
  comparator and its policy entry, and takes it off that list. Raise the policy's `version` when a rung, a class
  or a limit changes. Two rungs may compare one quantity, each with a comparator that names its rung: `r2`
  (geometry and mask) and `r3` (optical path) both ask the `rays.trace` requests of `rayTraceRequests`, so an
  engine traces a set once.
- **A comparator is given the request's spec and the run's case** (`ComparisonContext`) and says "not comparable"
  when it needs one that is missing; it never guesses. A metric it cannot measure on two answers goes under
  `unmeasured`, is not judged, and is named in the pair's reason.
- **`FLOOR` is a pass, counted apart, and its limits live in the policy** (`floor` on a rung and on its metrics;
  `src/compare/floor.ts`). Only a pair of the floored engine (`lv`) can be `FLOOR`; a metric without floor limits
  (the mask) always fails. Every metric that has floor limits is held to them together, whichever is above its
  gate: hits, landing and, since policy version 4, the exit direction (1e-8, with the others within 1e-12 of
  `ref`). Never add a floor limit, or widen one, to make a lens pass.
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
  red. A name added to the import manifest changes the closure: measure and pin again.
- **The fake LV tree (`test/fixtures/fake-lv-binding`) has a tracer, an MTF launch, a product MTF and tab
  defaults of its own**, with LV's names; its defaults are deliberately not LV's. A name added to the import
  manifest needs a fake of it there, and a new fake file a line in `FAKE_ENGINE_FILES`
  (`test/engines/lv/support.ts`). `variantOf` rewrites a file of a copy for one test.
- **`reports/benchmark/lv-floor.{json,md}` is the committed digest of the benchmark** (`src/report/floor.ts`):
  results, counts, run names and hashes only. An integration test holds its figures to a fresh run while LV's
  engine closure is the one it names. Regenerate it with `run ... --rungs r0,r1,r2,r3`, `compare` and
  `report --floor` after a change to `ref`, to the `lv` adapter, to the import manifest (the closure it names) or
  to the figures: it names both engines by hash.
- **Reports are golden-tested** against `test/fixtures/golden`. A change that is meant to change a report rewrites
  them with `node test/report/writeGolden.ts`; read the diff. `comparePair`, `compareGroup`, `buildReport` and
  `renderMarkdown` are pure functions and stay so.
- **Reports and baselines are deterministic**: no timestamps, no machine information.
- **Recorded differences are not errors.** Only direct and identical-ray rungs are gated; see the ladder in the
  plan before adding a tolerance.
- Formatting follows LV: double quotes, 120 columns.
