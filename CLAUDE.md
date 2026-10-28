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
npm run verify:real    # Stage 5.4: lvrtc doctor, then baseline check benchmark and benchmark --mtf on live LV and optiland, one at a time; NOT part of check
npm run verify:real -- --all   # the same for every routine committed suite in a fixed order (not the catalog, a dated snapshot: --suite catalog); --suites a,b and --jobs <n> (default 4, a ceiling)
node bin/lvrtc.mjs     # the CLI
node bin/lvrtc.mjs doctor   # Node, config layers, LV, Python and optiland as this machine sees them
node bin/lvrtc.mjs run suites/features.json --rungs r0,r1,r2,r3,r4 --jobs 2   # process pool; default --jobs 1 is serial
node bin/lvrtc.mjs compare features --jobs 2   # parallel comparisons, collected in manifest order
node bin/lvrtc.mjs baseline check features --jobs 2   # the same pool for baseline suites
node bin/lvrtc.mjs mtf nikkor-z50f12 --profile benchmark --jobs 2   # the same pool for MTF benchmark suites
node bin/lvrtc.mjs store compress        # OWNER ONLY: dry run; counts and bytes before/after
node bin/lvrtc.mjs store compress --yes  # OWNER ONLY: atomically gzip legacy plain entries
node bin/lvrtc.mjs store prune           # OWNER ONLY: dry run; unused engine versions, protected by HEAD baselines
node bin/lvrtc.mjs store prune --yes     # OWNER ONLY: delete only entries no committed baseline engine can hit
node bin/lvrtc.mjs run test/fixtures/suites/fake-pair.json --root test/fixtures/fake-root   # a suite on fake engines
node bin/lvrtc.mjs compare fake-pair --root test/fixtures/fake-root   # compare a run: writes comparisons.json
node bin/lvrtc.mjs report fake-pair --root test/fixtures/fake-root    # report a compared run: report.json, report.md
node test/contract/writeCorpus.ts   # rewrite contract/fixtures after editing test/contract/corpus.ts
node test/report/writeGolden.ts     # rewrite test/fixtures/golden after a change meant to change a report
node bin/lvrtc.mjs engine conformance fake-py --root test/fixtures/fake-root   # the conformance kit on one engine
node bin/lvrtc.mjs lenses list                 # every LensVisualizer lens: key, name, file
node bin/lvrtc.mjs lenses show nikkor-z50f12   # one lens as LV prepares it for tracing: a row per surface, with whether its rim clips (console only)
node bin/lvrtc.mjs export nikkor-z50f12        # one lens as an engine-neutral case (stdout; never committed)
node bin/lvrtc.mjs export --all --census reports/census   # every lens, a zoom at both ends; rewrites the census
node bin/lvrtc.mjs run suites/states.json --rungs r0,r1,r2,r3,r4   # the stop-down and zoom-station matrix on its own engines (lv, ref, optiland); then compare states, baseline write states
node bin/lvrtc.mjs run suites/states.json --rungs r4,r4f,r6a        # its gated MTF rungs; then compare states, baseline write states --mtf (the same for focus-stations)
node bin/lvrtc.mjs run suites/catalog.json --rungs r0,r1,r2,r3,r4 --jobs 4   # OWNER ONLY: every catalog state (1,341); MTF with --rungs r4,r4f,r6a; recipe in docs/REFERENCE.md, Stage 5.3
node bin/lvrtc.mjs report catalog --catalog    # reports/catalog.{md,json} from the two catalog baselines alone
node bin/catalog-case.mjs <run> suites/catalog-repro/<run>.json   # a one-run reproducer of one catalog state (suite catalog-repro)
node bin/catalog-attribution.mjs <temporary LVRTC_RUNS_DIR>       # after a reproducer: 60-digit LV/ref check, native optiland rows
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
node bin/lvrtc.mjs statement                   # write reports/validation-statement.{json,md} from the eight baselines alone
node bin/lvrtc.mjs verify                      # hermetic: baselines valid, committed reports byte-identical; the catalog held to its frozen policy; part of check
node bin/lvrtc.mjs engine conformance optiland # the same on optiland: starts the Python worker (about 3 s; 17 s on an empty cache)
node bin/lvrtc.mjs run suites/benchmark.json --engines lv,ref,optiland --rungs r0,r1,r2,r3,r4   # three ways: built system, first-order data, LV's launch rays, optical path, geometric MTF; what the baselines are of
node bin/lvrtc.mjs run suites/benchmark.json --engines lv,ref,optiland --rungs r0,r1,r2,r3,r4,r7a --jobs 4   # with R7a, the spot of the coma and bokeh tabs' rays: the rays baselines from the Phase 6 end refresh (about 2 min)
node bin/lvrtc.mjs run suites/benchmark.json --rungs r7b --jobs 4   # R7b: LV's coma and bokeh tabs beside optiland's SpotDiagram and RayFan, recorded; asked of lv and optiland; only where named; in no baseline
node bin/lvrtc.mjs run suites/benchmark.json --engines lv,ref,optiland --rungs r8a,r8b --jobs 4   # R8a, the axial intercepts of the spherical-aberration and axial-colour sections' rays (gated, about 15 s), and R8b, the sections beside optiland's own rays and focus (recorded, only where named, in no baseline)
node bin/lvrtc.mjs run suites/benchmark.json --engines lv,ref,optiland --rungs r9a,r9b --jobs 4   # R9a, the chief rays of the distortion, pupils and lateral-colour tabs (gated), and R9b, the tabs beside optiland's own distortion, chief rays and pupils (recorded, only where named, in no baseline); about 3 min from an empty store
node bin/lvrtc.mjs run suites/benchmark.json --engines lv,ref,optiland --rungs r10a,r10b --jobs 4   # R10a, the tangential and sagittal foci of the field-curve sections' parabasal rays and real-ray fans (gated), and R10b, the sections beside optiland's own FieldCurvature (recorded, only where named, in no baseline)
node bin/lvrtc.mjs run suites/benchmark.json --engines lv,ref,optiland --rungs r11a,r11b --jobs 4   # R11a, which rays of the vignetting tab's beams get through, their flux into the image and the landings of its mapping's chief rays (gated), and R11b, the tab beside the flux of LV's lattices, engine flux (recorded, only where named, in no baseline); several minutes and about 10 GB of the store from empty
node bin/lvrtc.mjs run suites/benchmark.json --rungs r12b --jobs 4   # R12b, LV's summary tab and aperture control beside optiland's paraxial accessors and working f-number (recorded, only where named, in no baseline; asked of lv and optiland); seconds
node bin/lvrtc.mjs run suites/benchmark.json --rungs r13b,r14b --jobs 4   # R13b, the comparator's Seidel sums (ref-seidel) beside optiland's, and R14b, optiland's Zernike fit beside the comparator's of the same samples (optiland-wave); recorded, only where named, in no baseline; about 8 min
node bin/lvrtc.mjs mtf nikkor-z50f12           # the MTF LV's own tab presents; --aperture f/8 for its comparison
node bin/lvrtc.mjs mtf nikon-z-24-70f4s        # a zoom: both ends, two tables; --zoom 1 for the tele end alone
node bin/lvrtc.mjs mtf nikkor-z50f12 --profile benchmark --engines lv,ref,optiland   # the MTF benchmark of one lens: 8 runs (a zoom 16), r4 r4f r6a judged, r6b r5 r5g r6c recorded; prints the MTF report, writes runs/mtf-<lensKey>/
node bin/z50f12-investigation.mjs suite|table|sampling|lv-grid|optiland-grid <tmpdir>   # Stage 4.2's evidence: docs/z50f12-investigation.md
```

## Rules

- **Node `>=24.15.0 <25`, ESM, no build step.** Sources run under Node's native type stripping, so only erasable
  TypeScript is allowed (`erasableSyntaxOnly`): no enums, namespaces or constructor parameter properties.
- **Import TypeScript with `.ts` specifiers** and use `import type` for types (`verbatimModuleSyntax`).
- **Suite concurrency is explicit** (`--jobs <n>` on `run`, `baseline check`, and `mtf --profile benchmark`): a positive
  integer, default **1 (serial)**, capped by available parallelism and by the memory budget (`maxJobs`,
  `src/cli/jobs.ts`). `--memory-budget <GiB>` defaults to **25% of installed RAM minus 2 GiB** for the controller
  and reserve, leaving room for the owner's other applications. Divide it by **2.5 GiB/job**, or **4 GiB/job**
  when the selected suite/baseline rungs include `r6c` (optiland plus optiland-wave). A serial run (jobs 1) starts no
  pool and is always allowed, whatever the budget (a 16 GB machine's budget is 2 GiB); an overlarge value is a usage error naming both
  budget and estimate. On this 48 GiB machine the default budget is **10 GiB**, allowing **4 jobs**, or **2
  for R6c**. These are conservative planning estimates, not an allocation or a physical memory guarantee.
  Higher values use at most n Node child processes, each bound to
  the configuration's one LV tree and owning its engine replicas for the whole suite. Every replica has its own
  validated hello; optiland is still started only through its definition, `optilandWorkerEnvironment` and its existing
  timeouts. A slot waits an engine's `runMs` plus `SLOT_MARGIN_MS` (60 s, for the child's store work) before it kills
  its child, so an in-process engine job, unbounded in a serial run, is bounded there. On SIGINT or SIGTERM the
  controller ends its children and removes staged entries and prepared inputs before it dies of the signal. No killed
  worker is restarted. Terminal failures are admitted in request order per engine; later speculative answers of that
  engine are discarded, so its subsequent jobs fail as in serial execution. Other engines continue. Jobs, callbacks and
  manifests retain planned order; follow-ups wait for their run's rung and precede its next rung. Duplicate store
  requests wait for their first answer. Pool code is outside engine import closures: concurrency changes no fingerprint,
  adapter revision, store key or persisted byte. Parallel suite expansion/export, recipe/ray/request preparation and the
  store's lookup, validation, canonical JSON, gzip and temporary writes execute in the same persistent children. Large
  result arrays stay there; the controller receives outcome summaries and atomically renames admitted entries. At most
  32n jobs compute or await admission; a completed staging file releases its CPU slot and survives later child death.
  Duplicate waits do not occupy workers; validated outcomes are reused only while the store file's inode, size, mtime
  and ctime remain unchanged (nanosecond timestamps). Changed files are read and validated again. Speculation after
  engine death is deleted, and remaining temporary files are cleaned after all workers exit. Prepared request bodies use
  transient V8 binary files (numeric bits preserved) and a four-run LRU per child. Dispatch sends small references. Full
  specs remain available to follow-up decisions. Planned-order tickets are assigned before duplicate waits, and
  requested backend hellos start alongside recipe/ray preparation. Inputs are deleted after every worker exits and never
  enter store identities. `compare --jobs <n>` uses a separate bounded thread pool across runs, keeping each run's spans
  and blocking ledger together and collecting in manifest order. Baseline checks and benchmark MTF share both paths. Opt
  into parallelism for workloads that amortize startup and replica memory. A custom `runSuite` registry supplies its own
  isolation. `LVRTC_PROFILE_DIR=<temporary directory>` records per-process phase timings and peak RSS outside run
  artifacts. The controller samples child RSS and interpreter-owned worker RSS heartbeats every 250 ms;
  Python's own current RSS comes from Mach task_info on macOS or /proc/self/statm on Linux, with lifetime peaks
  also reported. Unknown custom launchers require `ps` descendant accounting. Above the budget, new dispatches
  wait until the sum falls; running work and ordered result publication continue. No job is killed for memory.
  Sampling failures also pause dispatch until readable. Never use `os.freemem()` to estimate macOS pressure.
  Profiles include `pool-memory-*.json` with peak simultaneous RSS, per-slot/worker peaks and pauses. These
  scheduling diagnostics stay outside engine source hashes and persisted results. See `docs/REFERENCE.md`.
- **New result-store entries are `<key>.json.gz`**, gzip of exactly the canonical JSON plus newline the plain
  entry held. Legacy `<key>.json` remains readable; gzip takes precedence when both exist, and corruption is
  reported rather than hidden by the other copy. No key or identity changes. Writes publish atomically.
- **Store maintenance is run only by the owner**, never by an implementer against `runs/store`. `lvrtc store
  compress` and `store prune` are dry runs unless `--yes` is explicit. Compression reports file counts and bytes
  before/after, writes a temporary gzip, renames it, then removes its plain source; conflicting duplicates are
  refused. Pruning reads only Git HEAD's committed `baselines/*.json` blobs, protects every exact
  `(engine id, fingerprint, adapter revision)` tuple they name, and reports retained/removable files and bytes
  per engine and per removable engine version (with its newest entry), and always states `PRUNE_NOTICE`: the
  engines as the checkout runs them are protected only once baselines written with them are committed, so prune
  after a refresh is committed, never before. Missing/invalid committed baselines abort pruning; unreadable/corrupt
  entries are retained.
  Run maintenance without concurrent suite/store writers. Tests and measurements use temporary `LVRTC_RUNS_DIR`
  directories; the real store, LensVisualizer and optiland remain untouched.
- **Zero runtime npm dependencies.** Validators, hashing and codecs are written here. Dev dependencies are tooling
  only.
- **Tests are `node:test`** in `test/**/*.test.ts`. Unit tests are hermetic: they need neither LV nor optiland.
  Integration tests skip with a stated reason when LV or optiland is not configured.
- **LV and optiland are read-only.** Never edit either checkout. LV is imported only from
  `src/engines/lv/binding.ts`; optiland is called only from `workers/python/lvrtc_optiland`.
- **The LV binding is the only door to LV.** To use one more LV function, add its name to
  `src/engines/lv/manifest.ts` and its signature to `LvApi` in `src/engines/lv/types.ts`; the type check fails
  until the two agree, and the binding checks the export at load time. Prefer LV's public barrels
  (`buildLens`, `optics`, `fieldGeometry`, `analysis`, `mtf`, `geometry`, `chromatic`) wherever they export the name;
  use deep modules otherwise. A pre-rewrite checkout with `src/optics/compat.ts` is refused with `import-failed`
  and a message requiring the rewrite merge `460f841f` or later. Types of LV values are local structural
  types: never `import type` from the LV path, so `npm run typecheck` passes with no LV on disk.
- **The LV engine fingerprint covers engine code only.** Lens prescription files (`src/lens-data/**/*.data.ts`,
  `*.teleconverter.ts`) are hashed one by one into the catalog and never into the engine closure.
- **Read a prepared state, not the authored lens.** The runtime stop radius is `state.surfaces[stopIndex].sd`;
  never read a surface's `source` or `base`, `L.stopPhysSD` or `L.totalTrack`. `syntheticKind` in the binding is
  the one reader of `source` (LV keeps the rear-plate flag nowhere else).
- **The exporter translates and never approximates.** What the contract cannot express is a coded problem for
  that run. A rule LV keeps only in its UI (the stop-down formula) is mirrored here with a source canary in
  `test/integration/lv/canaries.test.ts`. Hermetic tests use synthetic numbers only, never an LV-derived value.
- **Lens files are V2.** `buildLens` takes their default export directly. A zoom is detected from
  `data.zoom?.stations` with at least two stations, never from V1 `zoomPositions`. The runtime's canonical lens is
  `source`, not `data`; source stop `sd` can be a placeholder 0, so read the prepared stop instead.
- **MTF entry points take `(request, settings)`**: `assessMtfSupport`, `computeMtf`, `computeMtfSteps`.
  `lvMtfInputs` in `tabRequest.ts` is the one bridge that calls `createAnalysisRequest`, with the prepared state,
  `dynamicEFL: 0` as in LV's worker, and the two current radii. Settings omit the radii. Lower-level helpers take
  `MtfOptions` resolved from `request.aperture` by `lvResolvedMtfOptions`, including
  `request.pose?.active ?? settings.movementActive`; canaries hold both mappings to LV. `lvMtfRequest` remains the
  one case/spec request builder shared by product MTF and replay; never duplicate its policy.
- **A zoom is compared at both ends wherever no zoom position is stated** (`src/engines/lv/zoomEnds.ts`): a suite
  run of an LV zoom without `state.zoomT` is two runs, `<name>-wide` and `<name>-tele`; the census and `lvrtc mtf`
  without `--zoom` do the same. Baselines (Stage 2.6) are keyed on those runs as run, by name and case id as the
  manifest lists them, never on the suite file as written. The expansion is the LV case source's
  (`CaseSource.expand`), never `expandSuite`'s, and the runs it gives are ordinary runs; a suite's hash is that of
  the file as written. An explicit position is one state. A prime has no zoom position: one stated for it is taken
  as 0 (`exportCase`). Middle stations are run only where a run states one or selects them. `lvrtc export <key>`
  and `lenses show` stay single-state and hint at `--zoom 1` on stderr.
- **States LensVisualizer selects are `lens.stations`, expanded by the LV case source** (`src/engines/lv/stations.ts`,
  through `CaseSource.expand` like the ends): `"published-zoom"` is the ends plus LV's `publishedZoomStations`,
  sorted, each once (`-wide`, `-zoom<T>`, `-tele`; a prime one run); `"certified-focus"` is every conjugate
  LV declares certified, including a station its MTF gate refuses
  (`-<key>-zoom<station>-focus<keyframe>`; `key: "*"` selects its catalog declarations). Without `stations`,
  `key: "*"` selects every catalog lens, then ordinary zoom-end expansion; source refusals stay ordinary runs. A declared station
  the gate refuses (two fisheyes at `ab0fd4cf`) remains an ordinary run with the coded problem
  `finite-conjugate-unavailable` (the gate's `unsupported-path` supplies no finite conjugate). A selector with
  stated coordinates
  (`station-selection-conflict`) and an empty selection (`no-certified-stations`) are coded problems of one run,
  never a suite of no runs. The address-to-slider mapping is LV's `mtfFiniteConjugate`, restated with a canary.
- **Contract minor 3 covers station selectors and policy `attentionSeveralLines`** (`CONTRACT_VERSION_1_3`):
  `runContractProblems` / `loadSuiteValue` refuse earlier-minor station selectors; policy schema and
  `policyProblems` refuse earlier-minor several-line bands. `suites/states.json`, `focus-stations.json` and
  policy version 14 state 1.3. A baseline recording source problems also states 1.3, with nullable `caseId`
  and `problems`; other baselines, cases, requests, results and manifests are written as before.
- **One heavy command at a time, across the main session and all agents.** A tier, suite or pool test is a
  heavy command. Never run `test:lv` alongside `test:optiland`, or overlap either with another heavy command.
  Agents must coordinate with the main session before starting one. Real-engine runs use **at most --jobs 4**,
  subject to the lower memory ceiling (R6c defaults to 2 here). Both integration tiers run only as
  `node --test --test-concurrency=1 ...` (the npm scripts enforce this); `npm test` caps hermetic file
  concurrency at **4**, because hermetic tests also start children/pools. Never run prettier on `docs/`.
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
  (vertex, geometry class, radius, conic, terms, `tol`, `max_iter`, aperture class and both radii (none of the three for a surface that does not clip), stop,
  interaction model, coating, index, the index of the image space, object and image planes, stop diameter,
  wavelength) and holds it to the
  case, then holds optiland's sag to the contract's; `describe_optics` writes `system.describe` from the optics
  and is never given the case. An optic that differs is the error `build-mismatch`, naming surface and field. A
  keyword added to the build needs its read-back check and a test that makes the mistake on purpose
  (`test_build.py`): removing a check must turn a test red.
- **How a case becomes an Optic**: every surface placed by `z=`, never by thickness; one Optic per line
  (`IdealMaterial` is constant and first-order data is the primary wavelength's); `RadialAperture(r_max, r_min)`
  on every surface that clips, the stop included, and `aperture=None` on a surface of the case that does not clip
  (`physical_aperture`, `expected_aperture`; never a `RadialAperture` of infinite radius, which is still an
  aperture); `float_by_stop_size` takes the stop diameter; an asphere stays
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
  engine option `fftRays` (128, 256 or 512: the ladder is that and half of it; 128 is the Stage 4.2 diagnostic step):
  an option is in the result store's key
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
  `system.describe` is version 2 (`innerClipRadius`; its `clipRadius` is +Infinity for a surface the engine does not
  clip at, which raised no version); `paraxial.first-order` is version 1. `mtf.native` is version
  1 and is answered by `lv`, `replay`, `wave` and `optiland`. `spot.native`, `axial.native`, `chief.native` and
  `curvature.native` are version 1 and are answered by `lv` and `optiland`; `vignetting.native` is version 1 and is
  answered by `lv` and `flux`; `summary.native` is version 1 and is answered by `lv` and `optiland`; `seidel.native` is
  version 1 and is answered by `ref-seidel` and `optiland`, `zernike.native` version 1 by `optiland` and `optiland-wave`.
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
- **Real-policy rung tests require PASS** (`assertR2`, `assertR3`): policy version 11 grants no floors. LV and ref
  must fail no ray; an optiland failure is allowed only on an asphere where LV and ref both block that same ray
  at that same surface, with each named in a diagnostic (the focus-station case in `docs/gotchas.md`). The
  tier-2 rung tests hold upper bounds only. Floor machinery is tested with synthetic policies.
- **An exception in an engine's `run` is a result** of status "error", code `engine-failure`, `ok: true`, in the
  Python kit as in `createProtocolHandler`. `ok: false` is for what the protocol could not handle, and for an
  engine that cannot describe itself.
- **Built-in engines (`ref`, `lv`, `replay`, `wave`, `flux`, `optiland`, `optiland-wave`, `ref-seidel`) live in `src/engines/builtin.ts`** and run only where
  named: `--engines` or a suite's `engines`. The one exception is a rung that is about engines of its own
  (`RungDefinition.engines`): `r4f` is asked of `lv` and `replay`, `r6b` of `lv` and `wave`, and `r6c` (run only where named) of `lv`, `wave`, `optiland` and `optiland-wave`, whatever
  `--engines` or a run names, `r7b`, `r8b`, `r9b` and `r10b` (each run only where named) of `lv` and `optiland`, and
  `r11b` (run only where named) of `lv` and `flux`, and `r12b` (run only where named) of `lv` and `optiland`, `r13b` of
  `ref-seidel` and `optiland` and `r14b` of `optiland` and `optiland-wave` (each run only where named); `r5` and `r5g` are run only where they are named. `ref` is written from the optics alone; never port LV's or optiland's code into it. `lv`
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
  `waveValidity.ts` are shared by `wave`, `optiland-wave` and `flux`; `src/rays/wavefront.ts` stays in `wave` and
  `flux` (its `imageSpaceIndices`).
  Keep all of them out of `lv`, `ref` and `replay`, whose adapter revisions the rays baselines hold. Its proof is
  analytic (`test/estimators`): closed forms with a derived quadrature
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
- **Stage 4.4's suites are `states` and `focus-stations`** (`docs/REFERENCE.md`, "Stage 4.4"): `states` is every
  benchmark lens at the slider's f/5.6 and f/11 (`f-number`) on both spectra and both planes, and its zoom also wide
  open and at `lv-f8-comparison`, every run `published-zoom` (128 runs at `ab0fd4cf`); `focus-stations` is
  `certified-focus` of the catalog, wide open, reference line, design plane (55 runs, 35 lenses; 53 export,
  two fisheye stations record `finite-conjugate-unavailable`). Both name
  `lv,ref,optiland` and the gated rungs `r0,r1,r2,r3,r4,r4f,r6a`: run them as features is run, `--rungs
  r0,r1,r2,r3,r4` for the rays baseline and `--rungs r4,r4f,r6a` for the MTF one, never all seven into one write.
  An f-number outside the slider (below the widest, above `maxFstop`) is a coded problem
  (`aperture-faster-than-wide-open`, `aperture-beyond-slider-range`), never clamped.
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
  concluded. Policy version 11 grants no floor on R4, as on every other rung.
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
- **R6a is gated at 2e-8 (policy version 11), pinned at Stage 3.12** at ten times the measured maximum 1.18e-9,
  rounded up to one digit, over 208 judged fields of the benchmark (LensVisualizer `ab0fd4cf`, closure
  `94778d3d`, 175 files). The bound now comes from the exact tracers' agreement, not LensVisualizer's rounding:
  `lv` and optiland agree to 1.56e-10, while optiland and `ref` differ by 1.158e-9, the same scale as Stage 3.8's
  1.15e-9. A pair of `ref` and optiland above an absolute 2e-9 is a defect (`r6a.test.ts` holds it, including
  flagged fields). No floor. Pin again from a measurement when the engines' numerics change.
- **R6b is recorded, never gated** (`src/compare/mtfWave.ts`): `mtfOnAxis.maxAbs` in a band of 0.005 and
  `mtfOffAxis.maxAbs` of 0.01, over the fields both answers stand by; a field an answer calls unconverged goes to
  `mtfFlagged.maxAbs`, in no band. A row near its band at f/8 is LensVisualizer's grid of 32 cells against the
  estimator's 64, not a method error (`docs/gotchas.md`).
- **`r5` is recorded, of three engines, and run only where it is named** (`r5Rung`, `onlyWhereNamed`): it asks
  R6b's one request of `lv`, `optiland` and `wave`, and optiland is handed the recipe's angles as its option
  `fieldAnglesDeg` (`recipeAngles`, matched by fraction, never by place); never a second request by angles. A
  photopic run has no optiland FFT row (`lines.polychromatic`). R6c supplies the separate raw-wavefront sum.
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
- **The chief-landing limit is a limit of sorting, per rung, and is no gate**: `r5` keeps 1e-7 mm (its optiland
  answer is one line only), `r5g` keeps its single 1e-3 mm limit. For `r6c` the owner's 2026-10-22 decision keeps
  `chiefLanding.maxAbs.attention` at 1e-7 mm when both answers record one line and uses
  `attentionSeveralLines: 1e-3` mm when either records several. Select from the answers, never the case alone;
  record each answer's selected `chiefLandingLimitMm` with its line wavelengths so `factsOfField`,
  `factsOfRecorded` and the report repeat the same sorting, including peers and baseline reports.
  On several lines LV's chief ray is one launch, solved at the d line without a wavelength and traced at every
  line; optiland-wave states optiland's line-0 chief aimed through the stop centre at 555 nm. They are different
  rays (1.1e-6 to 5.7e-6 mm apart in the two Stage 4.3 configurations, up to 3.0e-4 mm on the R5g benchmark).
  A common reference point does not change the modulus, so the several-line landing only checks that the
  answers are of the same field. Never read `imageHeightMm` of two engines on several lines as the landing of
  one ray. The several-line report names its selected sorting limit through a linted wording template.
- **On several lines optiland's column in R5g is the worker's sum of optiland's own landings**; the report says so
  under such a table (`GEOMETRIC_SEVERAL_LINES`), decided from the number of lines the answer records, and a test
  holds that only such a table carries the sentence.
- **Every sentence a report writes about a recorded comparison is a template of `src/report/wording.ts`**, and
  `wordingProblems` lints every golden report (`test/report/wording.test.ts`): a new sentence goes into that file,
  a new banned claim needs its rejected and its accepted examples in the test. `NOT_COVERED` is rendered in every
  report and says only what the measurement supports; change it only with the plan.
- **Stage 4.5's statement is baseline-only** (`src/report/statement.ts`, `lvrtc statement [--root <dir>]`): all
  eight baseline files of benchmark, features, states and focus-stations are required; no engine, clock or
  machine is read. It writes `reports/validation-statement.{json,md}`. `lvrtc verify` holds both files byte for
  byte (also requires them on a root with all eight suite baselines); `verify --write` regenerates them. R4 is
  deduplicated across rays/MTF, with differing duplicate measurements refused. Named suite/run configurations,
  configuration pairs and request pairs are separate counts. The supportable sentence, all prose about
  recorded comparisons and the rung descriptions are templates in `src/report/wording.ts`, linted at render
  time. Its hermetic synthetic goldens are written only by `node test/report/writeGolden.ts`. The owner signed
  off the supportable sentence word for word (2026-10-23): change its words only with the owner. The plan records
  the amended unnamed-state/catalog exclusion. Every committed `reports/**/*.md` passes `wordingProblems`.
- **MTF baselines are files of their own** (`baselines/<suite>.mtf.json`, `reports/<suite>/mtf.{md,json}`;
  `--mtf` on `baseline write` and `check`; `verify` holds both kinds). `buildBaseline` with `MTF_BASELINE`: the
  rungs r4, r4f, r5, r5g, r6a, r6b of the run, each metric with `measured`, a rung's `steps`, `bands` and, for r5
  and r5g, `sets`. The benchmark's holds all six, the feature suite's the three gated (run it with
  `--rungs r4,r4f,r6a`). The rays baseline has its own report and check; R4 is in both. Stage 3.12 rewrote
  all four baselines under policy version 11 at LV `ab0fd4cf`. The MTF report is rendered from the baseline alone
  (`src/baseline/mtfReport.ts`) and ends with the fixed Not covered
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
- **An edit to a file in a built-in engine's import closure (`src/contract/version.ts`, `src/core/negotiate.ts`, ...)
  changes its adapter revision**: all four baselines become STALE(engine) and the store recomputes lv, ref, replay
  and wave. Check, then write, each kind.
- **`lvrtc mtf --profile benchmark` is a suite of its own** (`mtf-<lensKey>`, `runBenchmark` in
  `src/cli/commands/mtf.ts`, `loadSuiteValue`): the conditions and cases are the benchmark suite's, so the store
  answers a benchmark lens; r5, r5g and r6c only where optiland is named; r6c on reference and photopic lines. It exits
  1 on a FAIL or ERROR pair. Without `--profile benchmark` the command is the single request of `lv-tab-default`.
  A test of it sets `LVRTC_RUNS_DIR` and closes the binding.
- **`npm run verify:real` is the real-engine check** (`src/cli/verifyReal.ts`, `bin/verify-real.mjs`; Stage 5.4). It
  plans every check first (suite files and baselines must exist; exit 2), runs `lvrtc doctor --root <root> --json`
  in a child and refuses (exit 2, no check run) unless Node is in range, LV is present, loadable, a git checkout and
  clean, and optiland's engine answers (optiland's own dirty flag only moves its fingerprint, so it is not refused).
  Then each `lvrtc baseline check <suite> [--mtf] --json` is a child `bin/lvrtc.mjs` of its own, strictly one after
  the other: benchmark rays then MTF, `--suite <name>` or `--suites a,b` (the kinds of baseline each has), or with
  `--all` `VERIFY_REAL_SUITES` (benchmark, features, states,
  focus-stations, folded, diffractive; rays before MTF; folded and diffractive have no MTF baseline). The catalog's
  baselines are a dated snapshot (policy 15, LV `879c06102`) not refreshed until the project's end
  (`SNAPSHOT_SUITES`): never in `--all`, checked only when named, and the plan says it is a snapshot.
  `--jobs` is a ceiling (default 4): a check gets `min(jobs, maxJobs(default budget, jobEstimateGiB(its baseline's
  rungs)))`, two for the benchmark's MTF with R6c on the owner's machine. A check is clean only when it exited 0,
  says `failed: false`, has records and every record is OK, REFRESHABLE or MOVED (`CLEAN_OUTCOMES`); DRIFT, an
  unlisted FAIL or ERROR, an engine error, NEW and GONE are not. A not-clean check fails the whole and the next
  still runs; a check ended by a signal (the memory watchdog) stops the sequence: rerun with fewer `--jobs`.
  SIGINT and SIGTERM to the script are both handed on at once to the running check (`forwardStopSignals`), so an
  interrupt ends it promptly; a pool controller ignores a second signal while it cleans up. It
  writes nothing itself; set `LVRTC_RUNS_DIR` to keep a measurement off `runs/store`. Tests are hermetic
  (`test/cli/verifyReal.test.ts`: scripted runner, and fake engines under a temporary root). A cold benchmark MTF
  check at `--jobs 2` is many hours (stopped by the owner after 6.5 h); on the warm owner store it is minutes. The
  stage's evidence is a cold features run (`docs/REFERENCE.md`, "Stage 5.4").
- **An edit of CLAUDE.md by a script is checked**: a replacement whose text is not found must stop the command
  that follows it, and what was written is read back before a commit says it was.
- **A surface that does not clip is `aperture.semiDiameter` null (contract minor 2).** A rear plate whose rim
  LensVisualizer generated (`clips: false` in its state, from `31c34396`) stops no ray and limits no field;
  `nominalSemiDiameter` is its extent, for the sag samples of R0 and a probe lattice and nothing else. It has no
  inner semi-diameter and is never the stop (`caseInvariantProblems`). Never read `aperture.semiDiameter` as a
  number without deciding what a null means there: `ref` holds an infinite clip radius, R2 has no rim band on such
  a surface (`inRimBand`), `system.describe` answers `clipRadius` +Infinity in every engine.
- **Contract minor 2 is stated only by a case that uses it** (`CONTRACT_VERSION_1_2`, `caseContractVersion`): a
  case with a surface that does not clip states 1.2 and carries the flag `aperture.unclipped`; every other case,
  and every request and result, is still `CONTRACT_VERSION` 1.0. The engines state `contract.max` 1.2 (the kit:
  `CONTRACT_VERSION_1_2`, `speaks`). No quantity's version moved for it. The fixture `all-features` carries every
  flag of contract 1.0 and `unclipped-plate` the flag of minor 2: never give `all-features` such a plate.
- **The exporter writes no clip radius only where LensVisualizer says so twice** (`surfaceAperture`): the state
  marks the surface `clips: false` and `evaluateAperture` reports no semi-diameter, no hole, and calls no height of
  `unclippedProbeRadii` outside. Any other answer throws, as before; a plate with a published rim clips. A canary
  holds the six LensVisualizer lines this rests on.
- **In `ref` a surface that does not clip is its sag wherever it has one**: a plane and a conic are met in closed
  form at any height; on an asphere whose conic does not end, a line on which Newton's method settles on no hit is
  failed, never blocked, since no stretch of it is the last to scan (a line along the axis is still met in closed
  form).
- **LensVisualizer's wide-open stop radius is the height of a traced ray**: a change of its intersection numerics
  moves the stop radius of nearly every lens by up to its tolerance, so every such case has another id and its
  records are STALE(case), not only STALE(engine). To tell what LensVisualizer changed from what the comparator
  changed, run the comparator on a `git archive` extract of the older LensVisualizer commit, outside both
  checkouts, with `LVRTC_LV_PATH` and `LVRTC_RUNS_DIR` set.
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
- **Investigations are result-only and outside every engine** (`src/diagnostics`, `workers/python/diagnostics`,
  `bin/z50f12-investigation.mjs`; Stage 4.2): no engine imports them, they write only into the temporary
  directory they are given, LV is reached through the binding and optiland through `lvrtc_optiland` under
  `optilandWorkerEnvironment`, with `prepare` and `protect_stdout` first. A name they need of LV still goes into
  the import manifest (`shearedOtf`), which moves the adapter revisions of `lv`, `replay` and `wave`.
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
  `r5` and `r5g` (`mtfNative.ts`), `r6b` (`mtfWave.ts`) and `r6c` (`mtfWavefront.ts`); `r5` and `r6b` ask one
  request, so an answer is computed once. No quantity is without a comparator today, and the test says so. Raise the policy's `version` when a rung, a class
  or a limit changes. Nine rungs compare `rays.trace`, each with a comparator that names its rung: `r2`
  (geometry and mask), `r3` (optical path), `r4` (geometric MTF) and `r6a` (wave MTF) all ask the `rays.trace` requests of
  `rayTraceRequests`, so an engine traces a set once; `r7a` (spot, `raysSpot.ts`) asks those of the spot sets,
  `r8a` (axial intercepts, `raysAxial.ts`) those of the axial sets, `r9a` (chief rays, `raysChief.ts`) those of the
  chief sets, `r10a` (field foci, `raysCurvature.ts`) those of the curvature sets and `r11a` (transmission and flux
  into the image, `raysVignetting.ts`) those of the vignetting sets. `spot.native` has the one
  comparator of `r7b` (`spotNative.ts`), `axial.native` the one of `r8b` (`axialNative.ts`), `chief.native` the one of
  `r9b` (`chiefNative.ts`), `curvature.native` the one of `r10b` (`curvatureNative.ts`), `vignetting.native` the one of
  `r11b` (`vignettingNative.ts`), `summary.native` the one of `r12b` (`summaryNative.ts`), `seidel.native` the one of
  `r13b` (`seidelNative.ts`), `zernike.native` the one of `r14b` (`zernikeNative.ts`).
- **A comparator is given the request's spec and the run's case** (`ComparisonContext`) and says "not comparable"
  when it needs one that is missing; it never guesses. A metric it cannot measure on two answers goes under
  `unmeasured`, is not judged, and is named in the pair's reason.
- **Policy version 11 has no floor on any rung or metric.** A pair above a gate is FAIL. LensVisualizer's
  1e-12 mm tolerance puts its worst R2/R3 distances from `ref` four to seven orders of magnitude inside the gates;
  the larger of each gate and ten times its measured residual is the gate, where a floor can never be granted.
  The Stage 5.3 catalog sweep needed none (its FAILs are classified mask mismatches, never floored). The machinery (`src/compare/floor.ts`)
  stays for a future engine and is tested with synthetic policies: `FLOOR` is a pass, counted apart, with limits
  on the rung and its metrics. The floored engine must be within `limit` of the arbiter; every other engine is a
  witness. A witness within `agreement` corroborates; otherwise its distance is named. A floor is refused when
  a witness sides with the floored engine against the arbiter (arbiter-suspect), or is as far from the arbiter
  as the floored engine in their pair. A metric without floor limits always fails above its gate. Never add or
  widen a floor to make a lens pass.
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
  hash is in the request id. A field without rays is a coded problem of that field and fails nothing. The spot
  sets of a run come from `CaseSource.spotRaySets` alike (Stage 6.2).
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
  FAIL in R4f by design. A test that removes a module to break a binding removes `src/optics/fieldGeometry.ts`, which
  nothing else imports; a test binding an edited tree through a case source edits the fresh tree in place, since
  a `variantOf` copy is closed only by `bind`. `zenith-plate-35` has a rear plate without a published `sd` (the fake
  generates a rim and marks it `clips: false`); `acme-zoom-24-48`'s plate publishes its rim and clips. A lens file
  added to the fake tree must sort after the existing ones: tests take the first three of `FAKE_LENS_FILES` by
  index.
- **Baselines are the committed record** (`baselines/<suite>.json`, contract kind `baseline`): for every run as
  run (name and case hash), rung and pair of engines, the verdict, metrics, counts, policy, fingerprints and
  adapter revisions; no ray arrays, no prescriptions. `reports/<suite>/rays.{md,json}` are rendered from the
  baseline alone. `lvrtc baseline write <suite>` writes both from a compared run and refuses a run with a FAIL or
  ERROR pair (the catalog alone admits a FAIL listed exactly in `docs/known-failures.json`). Source refusals are recorded as coded run problems with no ERROR pair.
  `lvrtc baseline check <suite>` needs the engines: per record OK, STALE(case|engine|policy) with
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
- **`wavefront.native` v1 is raw data, never an OTF** (`lvrtc_optiland/wavefront.py`). One line,
  field and even midpoint grid per fresh verified optic; `Wavefront.get_data` supplies sphere points, OPD in
  vacuum waves (reference minus path), intensity and validity. Keep the compact disc in its original order and
  scatter it into the full square. Read back every analysis setting, distribution coordinate and row count,
  strategy, image index, reference sphere and exit pupil. Every check has a deliberate fault in
  `test_wavefront.py`. Probe only the chief launch on a separate optic; no rim ray calibrates this operation.
  FATAL and REQUEST_BUDGET_S are the MTF worker's, including its noncached time-budget error. Failed fields are
  unavailable rows with reasons. The schema, corpus and stdlib Python validation port change together.
- **`optiland-wave` is the comparator's OTF of those raw samples**, never an optiland OTF. Its transport owns and
  closes the worker and negotiates raw quantity version 1. Its fingerprint is optiland's; its revision combines
  worker and comparator closures. The pure estimator `wavefrontOtf.ts` takes only decoded arrays, uses radial
  reference-sphere optical cosines, W=-lambda OPD and intensity as flux, and reuses `waveOtf` without moving any
  operation. The reference-sphere directions are not traced exit directions: say which model was measured.
  Analytic disc, tilt, defocus and annulus proofs with rim bounds, whole-number sums of an apodized pupil at
  an image index, and a translated sphere are in `wavefrontOtf.test.ts`. Keep the new
  estimator out of `lv`, `ref`, `replay` and the existing `wave` adapter's closure.
- **R6c is recorded, only where named, reference or photopic** (policy version 14, contract 1.3): R5's native request and angles,
  asked of its own four engines whatever `--engines` names, four columns `lv`, `wave`, `optiland`, `optiland-wave`. Reuse R5 sorting before every subtraction, including
  report peers. Bands stay 0.005 / 0.01; chief landing is 1e-7 mm for two one-line answers and 1e-3 mm
  when either records several lines; no gate or floor. Raw grids 128/256, quarter-wave
  and doubling flags; no automatic follow-up. Report sentences are wording templates,
  goldens come from writeGolden, MTF baselines may add its records; baseline rewrites remain the owner's.
- Formatting follows LV: double quotes, 120 columns.

- **Several-line `optiland-wave` is the comparator's complex sum, never a mean of moduli** (Stage 4.3):
  one `wavefront.native` request per case line, still one line per worker call. Validate each line's index,
  wavelength, weight, image-space index, fields, grids and case plane. Evaluate `wavefrontOtf` directly at every
  requested frequency, without frequency interpolation. `polychromaticWavefrontOtf` multiplies each normalized
  complex OTF by `exp(-2 pi i nu (chief_l-chief_0))` and case weight times transmitted cell flux, then adds
  compensated complex sums and normalizes by total weighted flux before the modulus. Chief coordinates stay in
  the declared y-mirrored frame, x sagittal / y tangential. Line 0's chief landing is the common origin, as the
  plan and case contract prescribe. LV uses one chief launch for all lines and `wave` uses the reference-line
  flux centroid: those are common origins too; changing a common origin rotates the whole sum and preserves
  its modulus. Do not recenter each line separately or change either existing engine. Each line retains its
  own chief-relative phase-step check; the complete spectral estimates supply grid-doubling convergence.
  A failed line makes its field unavailable and names the line; none is dropped. The case plane, including
  LV's photopic best-axial shift, is used unchanged. FFT stays unsupported on several lines.
  Report such a table with `WAVEFRONT_SEVERAL_LINES`, selected from its recorded line count and linted.
  Policy 14 states contract 1.3 for the several-line chief-landing member introduced in Stage 4.3;
  its limits retain policy 13's values. The MTF attention bands, classes, gates and quantity versions do not move.


## Stage 5.2a folded systems

- Contract 1.4 is content-selected: fixed `system.opticalPath` cases and requests using `quantityVersion`.
  Sequential cases and requests keep their earlier versions and identity expressions. `rays.trace` v1 remains
  sequential; v2 uses visit indices, repeats physical surfaces and permits reverse propagation after reflection.
  LV, ref and optiland offer both definitions. The request chooses; never globally replace v1 with v2.
- Export fixed prepared path metadata and side filters verbatim. Reverse-medium lookup is LV's bound
  `rearMediumSurfaceIndex`; no sample ray discovers a path and no axial-side guess selects an exact interaction.
  Auto paths, unexpressible planes and diffraction retain source codes. `mixed-reference` is an LV data issue.
- Folded active bands are conditional interactions: mirror holes transmit; blockers stop their closed band and
  transmit its complements. Ref determines incident side from its exact normal, keeps compensated paths and
  reflection dots, and proves singular pupils with exact rational arithmetic on the original inputs, never an
  epsilon. Its mirror proofs are in `test/engines/ref/folded.test.ts`.
- The optiland folded policy wraps native geometry, `RefractiveReflectiveModel` reflection and native
  `RealRays.refract`. Its window, side filters, native models and both side indices are read back. Its optical
  path charges native parameters to the actual per-ray medium; normalization correction remains in `trace.py`.
  An image policy charges the final stretch too. Every new read-back has a deliberate fault in `test_folded.py`.
  `material="mirror"` is the factory's mirror switch; `is_reflective=` is silently ignored and pinned as a fault.
- LV generalized OPL is explicitly absent: v2 may supply geometry with `pathUnavailable`; R3 then says
  UNSUPPORTED, never PASS with an invented zero. LV records no hit for a passive visit (a hole, an ignored
  inactive side, a blocker outside its band) but keeps a height for every visit under `recordHeights`:
  `alignFolded` (`src/engines/lv/rays.ts`) places each recorded hit on the one declared step whose height is
  that hit's own by LV's `projectCoordinateToZ`, to the bit, and the direction must not change across the
  steps between. Such a step is v2 `unrecordedHits` (NaN, flagged; never the exit visit) and R2 skips only
  that point; no point is computed for it. LV going on past the declared visits (its explicit traversal then
  searches its reflective surfaces) is `lv-folded-post-path-interaction`; a record that fits no single way is
  `lv-folded-unaligned-visits`; an unrecorded exit visit is `lv-folded-unrecorded-visit`. Canaries hold the
  LV lines. First-order values that LV supplies remain its own, even when an analytic proof identifies a
  defect. Keep R0 physical indices separate from R2/R3 visit indices.
- `suites/folded.json` is the 16-lens Stage 5.2a suite. Use temporary `LVRTC_RUNS_DIR` storage, no baseline, and
  no catalog ray sweep in Stage 5.2a; its rays baseline was first written at Stage 5.3 (policy 15, LV `879c06102`). Sequential compatibility is checked against temporary benchmark/features manifests
  produced by a `git archive HEAD` extract. Never freeze code fingerprints to keep old store keys alive.
- **Owner decision 2026-10-23: check the run's traced rays, not a static envelope.** The raw exporter keeps the
  declared path. `CaseSource.confirmRaySets`, called by `planJobs` after generating exactly the selected rungs'
  coarse/fine sets and before planning any engine request, uses LV's existing post-path detector on those sets.
  `folded-post-path-reflection` refuses the whole run (null case, source problem, zero jobs for every engine).
  Accepted folded cases carry `folded-declared-path-confirmed:run:<utf8hex>:coarse:<sets>:fine:<sets>` in existing
  provenance notes: reversible run name, ordered ray-set hashes joined by `.`, or `empty` / `unrequested`.
  This confirms only the listed finite sets. Never generate extra probes or infer an untraced geometric guarantee.
  Pool preparation returns the confirmed/refused runs as well as jobs, and serial/pool artifacts must match.
  Shared case ids preserve every run's note. Raw exports/census remain unconfirmed; request-time refusal remains
  a backstop. The owner fixed LV's principal-plane defect in `f9fb75c86` (included in clean `879c06102`); all four historical R1 FAILs now pass. The brief is
  `docs/upstream/lensvisualizer-mirror-principal-plane.md` (for the owner; not filed).
  At LV `2e046d71`, the folded suite has eight confirmed cases / eight source refusals, 144 jobs (135 ok,
  nine unsupported, zero errors), and historically 149 PASS / four FAIL / 87 UNSUPPORTED comparisons across both modes.
  The raw geometry census remains 995 lenses / 325 zooms / 1,320 states: 1,304 exports, 16 refusals, zero throws.

## Stage 5.2b diffractive surfaces

- Owner decision 2026-10-25: contract 1.5 is content-selected. Prepared radial optical-path polynomials remain on
  their substrate, with literal powers, coefficients, order and design wavelength. LV has no normalization radius;
  unknown members and inconsistent derivative/quadratic caches are `diffractive-phase-unsupported`, never fitted.
- Only diffractive cases ask `rays.trace` v3 and `paraxial.first-order` v2. Every earlier definition is still offered.
  Non-diffractive cases/requests keep their versions and identity expressions; source fingerprints are never frozen.
- `opticalPath` and `opticalPathToImage` still mean geometric index times distance. V3 adds signed **per-visit**
  `phasePath[S,n]`; the wave path adds its compensated sum to the geometric path. Never insert phase into the
  geometric arrays. LV records only geometric segments: supply all-NaN phase rows with `phasePathUnavailable`,
  `lv-phase-path-unavailable`, and keep comparing geometric OPL. R3 records the unavailable phase metric explicitly.
- Ref derives the surface-gradient momentum kick independently, with compensated polynomial/dot/path/matrix sums.
  `test/engines/ref/diffractive.test.ts` derives power, focal length, exact quadratic-phase focus, local grating
  deflection, signed phase path and a hybrid achromat. A quadratic phase has a height-dependent exact focus;
  never claim it is an aberration-free hyperbolic focusing phase. Check any LV/ref disagreement in extended precision.
- LV's paraxial kernel takes its own compiled phase, at its bound default d wavelength. Other phase wavelengths
  are `lv-phase-paraxial-wavelength`, never synthesized first-order data. Its MTF gate still refuses diffraction;
  this stage verifies R0–R3, with ordinary probe rays where the MTF launch gate supplies none.
- Optiland receives a native `RadialPhaseProfile` in radians and `PhaseInteractionModel` on the actual substrate.
  Its constant-period `DiffractiveInteractionModel` is not a radial polynomial. Design-coordinate metadata,
  native radian coefficients, class, both parent links, efficiency and reflection state are read back and checked;
  every check has a deliberate fault in `test_phase.py`. Describe reads only built objects. The worker separates
  native OPD into geometric segments and phase rows before its existing direction-length correction.
- Optiland's first-order accessor bypasses phase; answer `optiland-phase-paraxial-unseen`, never the substrate-only
  focal length. The direct native paraxial model also has the opposite transmitted phase sign; both behaviors are
  pinned analytically. Folded phase policies remain `optiland-folded-phase-unsupported` if asked directly.
- Policy 15 adds only `phasePath.maxAbs`, in waves, at 2e-5, the same absolute path accuracy required per phase
  interaction as per geometric path. Basis: separate signed eikonal delay on the identical ray, not a change in
  an existing gate. R0 counts a phase-profile difference under its existing zero `shape.mismatches` gate.
- `suites/diffractive.json`: eight lenses / nine states, lv/ref/optiland, R0–R3. Run into temporary storage with
  at most four jobs. Its rays baseline was written in Stage 5.3 (policy 15, LV `879c06102`); no gate widening or floor.
- Verification requires exact policy identity for every baseline except the catalog's: each states the version and
  hash of `policy/rungs.v1.json` at hand. The policy-14 transition is closed (Stage 5.3 applied the cleanup;
  `policy/rungs.v14.json` is gone). Phase-inapplicable metrics leave ordinary pair/report bytes unchanged.
- **The catalog baselines are a dated snapshot** (owner decision 2026-10-26: policy 15, LV `879c06102`; not
  refreshed until the project is done, so a later policy needs no re-sweep). `lvrtc verify` exempts
  `baselines/catalog.json` and `catalog.mtf.json` (`SNAPSHOT_BASELINE_SUITES`) from current-policy identity only:
  each must record a known frozen policy, `policy/snapshots/rungs.v<version>.json`, whose version and canonical hash
  are the recorded ones (`loadPolicySnapshot`; a recorded hash with no such file fails, so a forged one does); every
  recorded gate (tolerance and unit), band and rung quantity must be that policy's and no PASS may exceed its
  recorded tolerance (`baselineGateProblems`); both files must record one policy, no later than the policy at hand.
  Schema, invariants, canonical text, the known-failure classifications and their evidence, `reports/catalog/*` and
  `reports/catalog.{md,json}` are held byte for byte as before. Verify's output says the catalog is a dated snapshot
  of policy v15 at LV `879c06102`. Never edit or delete `policy/snapshots/rungs.v15.json` (it is not formatted:
  `policy/` is outside prettier). `baseline check catalog` still judges by the policy at hand (a later policy is
  STALE(policy), REFRESHABLE or DRIFT) and `baseline write catalog` still writes at the policy at hand. **The
  end-of-project refresh**: write both catalog baselines at the then-current policy N, `cp policy/rungs.v1.json
  policy/snapshots/rungs.vN.json` (write prints this line until the file exists, and verify refuses the snapshot
  until it does), render `lvrtc report catalog --catalog`, run `lvrtc verify`, and commit the baselines, reports
  and frozen policy together; vN is then the snapshot policy. Keep older frozen files only while a baseline records
  them.

- LV phase powers are integers 2 through 32, including odd powers (at most 16 terms). Preserve all of them.
  Optiland explicitly refuses `optiland-odd-radial-phase`; never assign an odd coefficient to an even slot.

## Stage 5.3 catalog implementation

- `suites/catalog.json`: `lens.key: "*"` with no station selector expands every catalog key through the case source,
  then ordinary zoom ends; wide open, reference line, design plane, lv/ref/optiland, gated R0–R4/R4f/R6a only.
  Source refusals remain coded runs. At clean LV `879c06102` this expands 1,341 states. Never run a full sweep
  as an implementer; the bounded sample is at most 25 lenses, using temporary storage and at most four jobs.
- Catalog-only baseline annotations state contract **1.6**: `runs[].features`, `censusReasons` and pair `failures`.
  The baseline writer copies flags from validated cases, and codes from source/field/recipe problems. No engine
  wire document or global `CONTRACT_VERSION` changes. All other suite baseline formats/FAIL refusals stay as before.
- `docs/known-failures.json` admits exact catalog FAIL evidence only. Each exceeding metric needs run/rung/ordered
  engines/metric, class in unsupported/data/convention/numerical/method order, gotcha link, one-run command and
  evidence hash. `failureEvidence` excludes annotations and optional MTF `measured` counts only. The baseline
  retains FAIL. Unchanged listed FAIL checks OK; any changed pair figure/count/location/classification or new FAIL
  is DRIFT. ERROR is never admitted; comparison always fails on FAIL. Empty after the zero-FAIL sample; the subsequent owner rays sweep has 83 FAIL rows on 12 lenses, attributed
  as method with 24 exact three-request aggregate entries and one-run reproducers. See docs/REFERENCE.md's Stage 5.3
  attribution table and docs/catalog-attribution.json.
  `lvrtc verify` reports a FAIL or ERROR in any baseline other than the catalog's, and a list entry that no
  classification of the catalog baselines uses (`unusedKnownFailures`): remove an entry once its FAIL is gone.
- `node bin/catalog-case.mjs <expanded-name> suites/catalog-repro/<name>.json` makes an ordinary one-run suite
  from the source expansion, without prescriptions. Its suite is named `catalog-repro`, so a reproduction never
  replaces `runs/catalog`; never name a reproducer suite `catalog`.
- `lvrtc report catalog --catalog` renders `reports/catalog.{md,json}` from its two baselines alone; verify holds
  the bytes. Missing inputs produce an explicitly incomplete report, never invented results. The filled stand-in
  golden comes from `node test/report/writeGolden.ts`. Counts by feature/reason, finite interpolated quantiles,
  worst ten, coded refusals and classified FAIL commands distinguish state/pair/request units. R4 duplicates
  must agree, excluding only MTF's optional measured counts. The validation statement still reads exactly eight
  baselines of benchmark/features/states/focus-stations, ignoring folded/diffractive/catalog additions.
- Rechecked folded at LV `879c06102` with jobs 4: eight accepted/eight refused states; 144 jobs (135 ok,
  nine unsupported, zero errors); R0 40 PASS; R1 17 PASS / 23 UNSUPPORTED; R2 80 PASS; R3 16 PASS /
  64 UNSUPPORTED. Total both modes **153 PASS / 87 UNSUPPORTED / zero FAIL or ERROR** after LV `f9fb75c86`.
- The 25-lens/28-state catalog sample has rays 1,248 PASS / 27 UNSUPPORTED and MTF 672 PASS, no FAIL/ERROR.
  Default-budget jobs 4 worker peaks: rays 4.25 GiB, MTF 5.70 GiB, no pauses. Linear full-sweep estimate:
  20.2 minutes run+compare, 11.6 GiB compressed store; raising only the budget to 20 GiB changes no worker count.
  Details, the known-failure workflow and the **sequential owner refresh**: docs/REFERENCE.md, Stage 5.3 (the one-off
  handoff is folded in there and deleted).
- The Stage 5.3 refresh is done at LV `879c06102` (policy 15): the eight existing baselines (no DRIFT), folded and
  diffractive (first baselines), and the catalog: rays 71,005 pairs, 70,843 PASS / 79 UNSUPPORTED / 83 FAIL, every
  FAIL classified in `docs/known-failures.json` (24 entries, 12 lenses: LensVisualizer's crossing-surface loss on 7,
  optiland's asphere iteration on 5, all class method, each with a `suites/catalog-repro` reproducer); MTF 40,944
  PASS. Baselines `catalog.json` 19,761 and `catalog.mtf.json` 9,079 records. The policy-14 cleanup is applied.
  The class says where a difference comes from, not that an engine is right: whether LensVisualizer's or optiland's
  behaviour behind these FAILs is fixed or reported upstream is the owner's; never edit a known-failure entry's class
  or gotcha, or a gotcha heading it links, without rewriting the catalog baseline (both are copied into it).

## Stage 6.2 spots and ray fans

- **Stage 6.1 is moot** (owner decision 2026-10-26): LV's optics rewrite left one trace stack, so there is no
  `lv-legacy` engine. Each Phase 6 stage's identical-ray rung covers the rays its own tab launches; never add a
  second LV tracer.
- **The spot sets are the rays LV's coma and bokeh tabs launch** (`CaseSource.spotRaySets`,
  `src/engines/lv/spotRaySets.ts`, setup in `spotSetup.ts`), generated by `planJobs` after `confirmRaySets`, only
  for a rung that says `needsSpotRaySets`, and recorded under `runs[].spotRaySets`. Per line: the coma cloud's rings
  at its preview fields, its tangential and sagittal fans at the detail field (`L.offAxisFieldFrac`), the bokeh
  tile's rings at its preview fields; each set has the chief ray last. Every sample is LV's own
  (`sampleCircularPupil`, `sampleOrthogonalPupilFan`, `computeOffAxisFieldGeometry`, `directionFromSkewSlope`), crossing
  the first vertex plane at `(x EPSD, yChief + y EPSD)` and launched `rayLead` before it, with the hook's EPSD
  (`lvPupilSeed`) and field geometry. Weights: area for the cloud, 1 for a fan, area times `lvRayWeights` for a tile.
  Every restated line has a canary (four Stage 6.2 tests in `canaries.test.ts`, one holding `traceSkewRay` to the
  tabs' skew adapter). `test/integration/lv/spotRays.test.ts` traces the sets with LV's exact tracer
  (`traceEngineRay`, the tabs' options) and, summed in LV's order, gets the clouds, fans and every tile's centroid
  and radius to the bit, and `lv`'s answers of all four asks are the tabs' output; it holds every tile ray by ray to
  LV's `traceSkewRay` (offsets from `lvBokehChiefLanding`, weights), on a shifted plane too and on
  `laowa-105mm-f2-stf`, whose absorbing glass tests the `lvRayWeights` stand-in for `sample.trace.transmission`.
  A finite object, a folded path, a fan on the axis, no launch or a vector launch are coded problems, never
  approximated.
- **R7a is gated, identical rays** (policy version 16): `rays.trace` of the spot sets, `raysSpotComparator`, on the
  rays valid in both answers of a pair (as R4); `transverseError.maxAbs`, `centroid.maxAbs`, `rmsRadius.maxAbs` at
  1e-8 mm and `mask.mismatches` at 0, no floor. Everything is relative to the chief ray (`groups.chiefIndex`,
  required). `no-rays`, `no-flux` and `no-reference` are unmeasured, never a FAIL. It is in the default rung
  selection and joins the rays baselines of benchmark, features, states and diffractive at the Phase 6 end refresh;
  focus-stations and folded have no spot sets.
- **`estimateSpot` (`src/estimators/spot.ts`) is a pure estimator** under the estimator rules: compensated sums, the
  rest of each landing difference kept, and the centroid carried in two doubles (a first value and a compensated
  remainder), so a spot far smaller than its distance from the chief ray keeps its radius. Analytic proofs in
  `test/estimators/spot.test.ts` (perfect focus, defocus disc, coma comet, tilted plane, exact dyadic definition,
  and a spot 2^-50 mm across 1024 mm from its chief ray, where removing any carried term turns it red). It is in no
  engine's closure.
- **`spot.native` v1 (contract 1.0) is a tab's own figures, never an OTF**: per field a spot (`centroidMm` relative
  to the chief ray, `rmsRadiusMm` about the centroid) or a fan (`pupil`, `errorMm`, odd sample count, NaN where a
  sample did not land), `imageHeightMm` the chief ray's landing, one line. Schema, corpus, `validate.py` port and
  invariants change together.
- **`lv` answers `spot.native` from LV's tabs as they present them** (`src/engines/lv/spot.ts`): the cloud of
  `computeComaAnalysis`, its two fans, `computeBokehFieldFootprint` on the case's plane, with the drawer's request
  restated (`tabRequest`, canaried). What the case and the spec decide is refused before LV is asked anything
  (a test makes every LV call throw): a line 0 that is not the authored indices (`lines.not-authored-reference`,
  every photopic run: the tabs trace no chromatic channel), angles, a finite object, a folded path, a bokeh tile of
  other rings (`pupil.rings`). Only `focus.off-design` (a coma pattern off the design plane) needs LV.
- **optiland answers `spot.native` with its own `SpotDiagram` and `RayFan`** (`lvrtc_optiland/spot.py`): one field per
  fresh verified optic, robust aiming, the hexapolar ring count nearest the asked rays, `reference="centroid"`
  (its default is the chief ray: pinned), global coordinates, the centroid relative to the chief ray's landing
  from `probe_field`, the contract's frame (y mirrored, a tangential fan reversed and negated). A fan whose middle
  ray is dark is `fan-centre-lost` (optiland silently refers it to the mean: pinned). Every setting is read back;
  each check has a deliberate fault in `test_spot.py`, and an off-axis spot is held to exact traces (`exact.py`), so
  the mirror and the chief-ray subtraction are tested. Budget and FATAL are the MTF worker's.
- **R7b is recorded, of `lv` and `optiland`, only where named** (`spotNativeComparator`): R5's `classifyNativeField`
  sorts each field before any difference. Owner decisions 2026-10-26: the chief-landing sorting limit is 1e-5 mm in
  the policy (a field further apart is data, its pair ATTENTION); the spot and fan figures have **no attention
  band** until the pupil-model difference is resolved: LV's collimated disc of the paraxial entrance pupil on
  equal-area rings against optiland's real stop to its rim, an LV assumption to look at, not settled
  (`docs/gotchas.md`, "Spots and ray fans"). R7b stays out of every baseline (run it with `--rungs r7b`, never
  beside the rays rungs before a `baseline write`). The bokeh tile at the tab's own plane (`infSensorZ`) is
  deferred and not covered.
- **Baselines are refreshed once, at the end of Phase 6** (owner decision 2026-10-26, as in Phase 4), never in a
  stage commit. Until then `lvrtc verify` and `test/cli/baseline.test.ts` ("the committed baselines and reports of
  this repository hold together") fail only on policy identity (v15 recorded, a later version at hand: v16 at Stage
  6.2, v17 at Stage 6.3, v18 at Stage 6.4, v19 at Stage 6.5, v20 at Stage 6.6, v21 at Stage 6.6b, v22 at Stage 6.7,
  v23 at Stage 6.8):
  never weaken either.
  Before its commit each Phase 6 stage checks the rays baselines for no DRIFT (`baseline check <suite>`). The new
  LV names and worker files moved the adapter revisions of `lv`, `replay`, `wave`, `optiland` and `optiland-wave`
  (which hashes the worker's revision, so R6c records go STALE(engine)); `ref`'s did not. The recipe is in
  `docs/REFERENCE.md`, "The Phase 6 end refresh". The validation statement (`STATEMENT_RUNGS` and the
  owner-signed sentence) stays unchanged and does not describe R7a.

## Stage 6.3 spherical aberration and axial colour

- **The axial sets are the rays LV's spherical-aberration section (aberrations tab) and axial-colour section
  (chromatic tab) launch** (`CaseSource.axialRaySets`, `src/engines/lv/axialRaySets.ts`, zones in `axialZones.ts`),
  generated by `planJobs` after `confirmRaySets`, only for a rung that says `needsAxialRaySets`, and recorded under
  `runs[].axialRaySets`. Two sets at every line: the profile's zones (`PROFILE_FRACS`), and the near-axis zone
  (`NEAR_AXIS_REAL_FRAC`), the marginal candidates in the order tried (`MARGINAL_PUPIL_FRACTIONS`) and the colour
  candidates not among them (`DEFAULT_LONGITUDINAL_CHROMATIC_FRACTIONS` as `normalizeFractions` keeps them). Each zone
  `f` is a mirror pair, ray `2k` at `f x r` and ray `2k + 1` at `-f x r` (`r` the tabs' pupil, `lvTabPupilSemiDiameter`),
  parallel to the axis from `rayLead` ahead of the first vertex (`bindRayTrace`'s `ray(h, 0)`), weight 1, field 0, no
  chief ray. Every restated line has a canary (three Stage 6.3 tests in `canaries.test.ts`).
  `test/integration/lv/axialRays.test.ts` traces the sets with LV's `traceEngineRay` (the sections' options; a
  channel's indices for colour) and gets `computeSphericalAberration`, `computeSAProfile` and
  `computeLongitudinalChromaticFocus` to the bit on every benchmark configuration and the zoom's far end, and holds
  every authored-index ray to LV's `traceRay`. A finite object, a folded path, no pupil and a launch behind the first
  surface are coded problems; focus-stations and folded have no axial sets.
- **R8a is gated, identical rays** (policy version 17): `rays.trace` of the axial sets, `raysAxialComparator`, on the
  rays valid in both answers of a pair (as R4). An intercept error is a transverse error over the ray's slope, so it is
  judged on the transverse scale: `intercept.maxScaled` = |dz| x the larger |dy/dz| of the two (the height at which each
  engine's ray passes the other's crossing), `focus.maxScaled` = the least-squares focus difference x the larger RMS
  slope, `focusRms.maxAbs`, each 1e-8 mm (R2's and R7a's figure), and `mask.mismatches` at 0; `intercept.maxAbs` and
  `focus.maxAbs` along the axis are shown beside them, never judged. No floor. **The owner accepted this gate as
  implemented (2026-10-26).** Always the larger slope of the two answers, never one engine's: a wrong, small slope must
  not scale its own difference away (`raysAxial.test.ts` holds both orders; min or either side alone turns it red).
  The intercepts bound the focus figure (Cauchy–Schwarz) only where the two answers' slopes agree: the focus figures
  are R8a's only sign of differing exit slopes, never call them a mere check of the estimator. A ray that crosses the
  axis in one answer and not the other, and a set off the meridional plane, are not comparable; a set of no mirror
  pairs has no focus. R8a is in the default rung selection and joins the rays baselines of benchmark, features,
  states and diffractive at the Phase 6 end refresh.
- **The axial estimator (`src/estimators/axialIntercept.ts`) is a pure estimator** under the estimator rules: the
  intercept `z - y n / m` in twice the precision, rounded once; the focus about the first intercept taken, compensated
  over exact squares and differences; heights rounded once; pairs taken only together (`pairsTaken`).
  `sphericalFigures` and `colourFigures` restate the sections' definitions (pair means, the first marginal pair, the
  least-squares focus of the profile's pairs, each zone's plus ray at the focus less the near-axis plus ray's; the first
  colour fraction crossing at two lines). An intercept or a slope that is no finite double is `out-of-range`, never a
  NaN or an infinity handed on. Analytic proofs in `test/estimators/axialIntercept.test.ts`: removing any carried rest
  turns a test red (the weight's and the RMS's square rests included; mutation-check a rest you add). It is in no
  engine's closure; `axialZones.ts` keeps `rays/probe.ts` out of `lv`'s.
- **`axial.native` v1 (contract 1.0)**: a `spherical` spec (one line, `nearAxis`, `marginal`, `profile`) or a `colour`
  spec (`lines`, the first the reference, `marginal`); per line `figures` (an engine's own) or `rays` (signed
  fractions, arrivals, exits), never both, and `paraxialFocusZ`. Schema, corpus, `validate.py` port and invariants
  change together.
- **`lv` answers `axial.native` from the sections as they present them** (`src/engines/lv/axial.ts`): spherical
  aberration only at a line of the authored indices; colour at each line whose wavelength is one of its channels'
  (`lvChannelLines`: C, d, F, g; C', e, F', g when every element is e-referenced; a mixed lens is
  `lines.mixed-reference`), a line that is none `lv-no-channel-at-line`, with `sampling.indexMaxDelta`, the largest
  difference of the channel's indices from the case's; both on the design plane only (`focus.off-design`). Which
  line a channel is, LV says: `lvChannelLines` asks LV's own `lensChromaticReference` (bound from the chromatic barrel)
  of `model.runtime.elements`, exactly the tab's `lensChromaticReference(L.elements)` (rear plates left out), and of
  each element alone for a mix; never read an element's `source` for it (canaries hold the tab's line and
  `runtimeView`'s). What the case and spec decide is refused before LV is asked anything but that reading (a test
  makes every other LV call throw). No paraxial focus.
- **optiland answers `axial.native` with its own rays** (`lvrtc_optiland/axial.py`): one verified optic per line; its
  ray generator at `(0, f)` of the builder's axial field, with optiland's default `paraxial` aiming, on the first line's
  optic; the launch read back (aiming, one `AngleField` on the axis, no vignetting or apodization, `EPD()` finite, x 0,
  height `f x EPD / 2`, direction `(0, 0, 1)`), each check with a deliberate fault in `test_axial.py`; those rays traced
  at every line (`trace.trace_rays`); `F2()` plus the image plane. The worker computes no intercept: the comparator's
  estimator forms the figures of rays. The read-backs include the field's type, every launched column's length and an
  `EPD()` of 0, each with a fault; a test with another pupil at each line catches a launch from another line's optic.
  The pupil and the focus are optiland's first-order data: the engine refuses `axial.native` of a case
  `first_order.term_refusals` refuses (a phase profile, a term of power 1 or 2) before anything is built.
- **R8b is recorded, of `lv` and `optiland`, only where named** (`axialNativeComparator`): the figures of rays are
  formed at the marginal fraction the other answer took. Each line is sorted before any difference
  (`classifyAxialLine`): R5's `classifyNativeField` first (no figures, other wavelengths), then this rung's data,
  `indices-differ` (an answer's `sampling.indexMaxDelta` above 0: one source of indices gives the same bits, so never
  a looser threshold) and `pupils-apart` (`pupilRadius.relative` above its limit: the spherical identifying ray, the
  near-axis pair's mean, lands on the axis whatever the pupil), then R5's landing (the near-axis mean, or colour's
  marginal ray), then method. `axialFactsOfRecorded` repeats the sorting from recorded values: change it, `factsOf`
  and `recorded` together. **Owner decisions (2026-10-26):** the 1e-5 mm landing limit stays; the spherical figures
  (`marginalIntercept`, `nearAxisIntercept`, `longitudinalSa`, `bestFocus`, `bestFocusRms`, `profile`) have an
  attention band of 1e-10 mm; colour's (`lineFocus`, `relativeFocus`) none until LV's index question is settled;
  `paraxialFocalShift.maxAbs`, a different quantity (spherochromatism), never one; R8b stays out of every baseline
  (`--rungs r8b`). The pupil limit, 2e-10 relative (ten times the measured 1.37e-11, rounded up), was signed off by the
  owner on 2026-10-26. On the benchmark every spherical line is of two methods, and since LV #925 (Stage 6.6b) every
  colour line too (every one was `indices-differ` before).
- **LV assumption found, resolved by LV #925** (`5ba17c20c`; `docs/gotchas.md`, "Axial rays"; owner's brief
  `docs/upstream/lensvisualizer-loca-unanchored-index.md`, not filed): LV's chromatic tab traced a d-line glass it
  matched to a catalog at the catalog's own Sellmeier index at every channel, its G channel included (LV's reference
  channel: the d line, 587.56 nm, in a d-line lens; never write "G line", which reads as Fraunhofer's g, LV's V); 877 of
  1,006 exporting lenses had such a medium, up to 3.0e-3 off. Since `5ba17c20c` the tier is anchored to the authored
  `nd` (`nd - S(G)` added to the catalog's C, F and g values, G returning `nd`): at the reference line the channel is
  the case's index to the bit on every lens, so `indexMaxDelta` is 0 there and R8b's colour lines of the reference runs
  enter its figures (on the benchmark all 24 colour lines are of two methods at `098c91ef6`, their foci within 8.4e-12
  mm of optiland's; every one was `indices-differ` before). At C and F (and g without a partial dispersion) the channel
  adds the same terms in another order than the case's anchored table, within one unit in the last place on about 800
  lenses; at g about 120 lenses whose elements state `dPgF` reconstruct V from it, by value (median 8e-6, up to 6.2e-4).
  **Owner decision (2026-10-27): no bit identity pursued at C, F and g now** (no committed suite asks those lines);
  `indices-differ` stays exactly as it is.
- The adapter revisions of `lv`, `replay`, `wave`, `optiland` and `optiland-wave` moved (new LV names, worker files);
  `ref`'s did not. Baselines are still refreshed once at the end of Phase 6; the recipe in `docs/REFERENCE.md` names
  `r8a` beside `r7a`.

## Stage 6.4 distortion, lateral colour, pupils and breathing

- **The chief sets are the chief rays LV's distortion tab, pupils tab and lateral-colour section launch**
  (`CaseSource.chiefRaySets`, `src/engines/lv/chiefRaySets.ts`, request and distortion reference in `chiefSetup.ts`),
  generated by `planJobs` after `confirmRaySets`, only for a rung that says `needsChiefRaySets`, and recorded under
  `runs[].chiefRaySets`; a case source without them is `chief-sets-unavailable`. Four patterns in `CHIEF_PATTERNS`
  order, one set at every line, the same rays at every line, weight 1: `distortion-curve` (the reference's near-axis
  probe, the edge, the curve's samples at the angles LV solved) and `distortion-grid` (the probe, the traced grid
  points with LV's interpolated pupil correction), each naming the probe under `groups.chiefIndex: 0`; `pupils` (the
  solved chief ray of each field off the axis); `lateral-colour` (since LV #925, `5ba17c20c`, each channel's own chief
  ray of each section field, solved through the stop at the channel's indices by `computeOffAxisChannelFieldGeometry`
  and launched as the coma tab's chief ray: four a field, R, G, B, V, `LV_LATERAL_CHANNELS`; all four at every line, so
  that R9a's spans stay a set's rays without its line and a line's own channel's ray is among them).
  Fields, solves, grid points and samples are LV's exports; what the tabs do inline (probe, edge, correction table and
  its interpolation, fields, `bindRayTrace`'s launch) is restated with a canary (four Stage 6.4 tests). **Which fields
  have a chief ray a set states is decided once, in `src/engines/lv/chiefFields.ts`** (`lvSolvedChief`,
  `lvPupilFields`, `lvLateralChief`), by the sets and asks and by `lv`'s answer alike: a field LV launches from a
  bounding sphere or has no slope for (at any channel, for the lateral colour) is a coded problem of the set, no field
  of the ask and none of `lv`'s answer, so
  `lv` answers every ask of its own case source (`chief.test.ts` feeds the asks of the fake's vector variant to
  `answerLvChief`). Never enumerate a tab's fields a second time; `chiefFields.ts` keeps `rays/probe.ts` out of `lv`'s
  closure.
  `test/integration/lv/chiefRays.test.ts` traces the sets with `traceEngineRay` and gets the curve, grid, pupils and
  lateral colour to the bit on every benchmark configuration and the zoom's far end. A folded path, a finite object, no
  half field, a fisheye's distortion (`lv-fisheye-projection`), no reference, a grid with no traced point
  (`lv-no-distortion-grid`: a probe alone is no set), an exit pupil at infinity, no pupil, no or a vector launch, and a
  launch behind the first surface are coded problems, never approximated. The case source
  also makes R9b's asks (`ChiefSetResolution.asks`).
- **R9a is gated, identical rays** (policy version 18): `rays.trace` of the chief sets, `raysChiefComparator`, a
  comparator of spans (`spanOf`: a set's rays without its line), on the rays valid in both answers of a pair.
  `landing.maxAbs`, `lateralColour.maxAbs` (each landing's move from the span's first line; inapplicable to one line),
  `distortion.maxScaled` (the displacement from the ideal point the engine's own probe landing scales; inapplicable
  without a probe) and `exitPupil.maxScaled` (the axial crossing difference times the larger exit slope, never one
  engine's: `raysChief.test.ts` holds both orders), each 1e-8 mm, and `mask.mismatches` 0; the percent
  (`distortion.maxAbs`) and the plain crossing (`exitPupil.maxAbs`) are shown, never judged. No floor. **The owner
  accepted this gate as proposed (2026-10-26).** Two conditionings are stated, not gated away: `exitPupil.maxScaled` is
  about `y dm / m` for exits at one height whose slopes differ by `dm`, so a nearly image-telecentric chief ray (y 20
  mm, m 2e-7) shows 1.1e-8 mm for one rounding of a direction; and `distortion.maxScaled` takes a probe-landing
  difference times `s_ray / s_probe` (about 100, 136 at a 50° half field, 200 to 270 for ultra-wide rectilinears), so it
  holds the probe's landing to about 4e-11 mm. A FAIL of either is attributed in extended precision before anything is
  concluded; never widen the gate for it. A line whose probe gives no distortion while others do is named in the pair's
  reason. R9a is in the default rung selection and joins the rays baselines of benchmark, features, states and
  diffractive at the Phase 6 end refresh; focus-stations and folded have no chief sets.
- **`estimateDistortion` (`src/estimators/distortion.ts`) is a pure estimator** under the estimator rules: the ideal
  point is the probe's landing times the ray's slope over the probe's, its product's rest kept (`twoProductError`), the
  displacement formed with the difference's rest (`twoSumError`) and rounded once; a ray without a distortion says
  why (`not-taken`, `reference`, `bad-landing`, `on-axis`, `out-of-range`), a set without a scale says why (a probe
  not taken; one of no height or slope; one off the meridian, an x slope or x landing other than 0). Analytic
  proofs in `test/estimators/distortion.test.ts`; removing either rest turns a test red. It is in no engine's closure.
- **`chief.native` v1 (contract 1.0)**: a spec of `kind` (`distortion`, `pupils`: one line; `lateral-colour`: lines,
  the first the reference), `maxFieldDeg` and `fieldAnglesDeg` (above 0 but for lateral colour); per field
  `chiefLandingMm` (the stop's chief ray: what identifies the field), `figures` or `chiefRay` (pupils: one of them;
  distortion: figures; lateral colour: neither), `sampling`; a `reference` (scale, probe angle, paraxial pupils).
  Schema, corpus, `validate.py` port and invariants change together.
- **`lv` answers `chief.native` from the tabs as they present them** (`src/engines/lv/chief.ts`): the distortion curve
  with each sample's solved chief-ray landing and `inversionResidualMm` beside it, the pupils tab's real pupils
  (`z0 + epRatio + epShiftMm`, `zLast + xpZRelLastSurf`) and stored paraxial ones, the lateral-colour section at each
  line that is a channel's (`lvChannelLines`: the landing of that channel's own chief ray) with `sampling.indexMaxDelta`, each at
  the fields `chiefFields.ts` admits. Refused before LV is asked anything but readings of the lens:
  `lines.not-authored-reference`, `lines.not-chromatic-channels`, `lines.mixed-reference`, `projection.fisheye`,
  `focus.off-design` (the last vertex plus its gap, for all three kinds, the lateral colour included), a finite object,
  a folded path; `fields.angles` once the tab is asked.
- **optiland answers `chief.native` with its own classes** (`lvrtc_optiland/chief.py`): distortion is
  `create_distortion_model("paraxial", distortion_type="f-tan")` on a fresh verified optic whose one field is
  `maxFieldDeg`, at the normalised field (the field is stated at the angle asked), under optiland's default `paraxial`
  aiming (accepted by the owner, 2026-10-26): never the robust aiming, which
  launches the model's 1e-10 probe along the axis and gives a scale of 0 (pinned). Each field is identified by the
  robust-aimed chief ray (`spot.chief_landing`); pupils are that chief ray traced once (`trace_generic` at (0, 0)) and
  `first_order.line_data`'s pupils. Frame mirrored in y. Every setting is read back (model class, type, reference
  point, near-axis probe, half field, aiming, value counts; the optic's field count, type, angles, vignetting, weight,
  half field, aiming; the chief ray's aimer, launch direction, rows, image plane), each check with a deliberate fault in
  `test_chief.py`. The engine refuses distortion and pupils where `first_order.term_refusals` does, before anything
  is built; lateral colour is not refused for it. Budget and FATAL are the MTF worker's. `PupilAberration` is another
  quantity and is never asked.
- **R9b is recorded, of `lv` and `optiland`, only where named** (`chiefNativeComparator`): each field is sorted before
  any difference (`classifyChiefField`): R5's `classifyNativeField`, then `indices-differ` (an `indexMaxDelta` above
  0), then the chief rays' landing against `chiefLanding.maxAbs` (1e-5 mm), then method. `chiefFactsOfRecorded`
  repeats it: change it, `factsOf` and `recorded` together. A pupil of a traced chief ray is the comparator's
  `axialIntercept`. **Owner decisions (2026-10-26):** the 1e-5 mm landing limit stays; no R9b figure has an attention
  band; R9b stays out of every baseline (`--rungs r9b`).
- **Breathing is R1's**: LV's chart is the focal length of a prepared state, `lv`'s R1 focal length within 2 units
  in the last place at every exported state (`test/integration/lv/breathing.test.ts`); chart positions between
  certified stations are no case, and are not covered (owner decision, 2026-10-26). No rung of its own.
- **LV assumptions found, the first two resolved by LV #925** (`5ba17c20c`; `docs/gotchas.md`, "Chief rays"; owner's
  brief `docs/upstream/lensvisualizer-chief-ray-conventions.md`, not filed): below one degree LV's chief ray was its
  paraxial estimate (its pupils there up to 1.30 mm from the stop's chief ray's, the Sony FE 400 mm); its lateral colour
  was one chief ray traced at every channel (up to 1.09e-3 mm on C, d, F). Since `5ba17c20c` every chief ray but the
  axis's is solved through the stop (a tolerance of `1e-7 · min(1, |θ| / 1°)` mm below one degree) and each channel
  traces its own (on the benchmark at `098c91ef6`: the pupils below one degree within 3.8e-6 mm of optiland's, 1.30 mm
  before; all 120 lateral-colour fields of two methods, their landings within 1.2e-10 mm, where every one was
  `indices-differ` and 22 pairs ATTENTION before; R9b has no ATTENTION pair). Its distortion curve still plots its
  targets (9.8e-5 mm) and its scale's probe is still up to half a degree off the axis (8.5e-6 relative): conventions R9b
  records.
- The adapter revisions of `lv`, `replay`, `wave`, `optiland` and `optiland-wave` moved (new LV names, worker files);
  `ref`'s did not. The recipe in `docs/REFERENCE.md`, "The Phase 6 end refresh", names `r9a` beside `r7a` and `r8a`.

## Stage 6.5 field curvature and astigmatism

- **The curvature sets are the rays LV's field-curve and astigmatism sections (aberrations tab) launch**
  (`CaseSource.curvatureRaySets`, `src/engines/lv/curvatureRaySets.ts`, the fields and lines in `curvatureFields.ts`),
  generated by `planJobs` after `confirmRaySets`, only for a rung that says `needsCurvatureRaySets`, and recorded under
  `runs[].curvatureRaySets`; a case source without them is `curvature-sets-unavailable`. The fields are
  `FIELD_CURVATURE_FIELD_FRACTIONS` and `FIELD_CURVATURE_CURVE_FIELD_FRACTIONS`, each fraction once, ascending (17 at
  `cfa91d0a5`), launched by LV's `computeOffAxisFieldGeometryScalar` (the solved chief ray's height, never a bounding
  sphere's). Two patterns, one set at every line, the same rays at every line, weight 1: `parabasal` (of each field the
  four rays `±p` of the pupil, tangential then sagittal, `p = min(0.02, max(1e-4, 0.01 / EPSD))`, then the chief ray)
  and `real-ray` (the tangential and sagittal fans of `sampleOrthogonalPupilFan(MERIDIONAL_COMA_SAMPLE_COUNT, ...)`,
  then the chief ray), each ray started as `lvSkewLaunch`. A set states no groups: a field is a block of consecutive
  rays of one direction, its chief ray last, a ray offset along y alone tangential, along x alone sagittal, one at the
  chief ray's start in neither (`src/rays/curvatureSets.ts`, `curvatureFieldsOf`); keep that layout, or the comparator
  says not comparable. Every restated line has a canary (two Stage 6.5 tests in `canaries.test.ts`).
  `test/integration/lv/curvatureRays.test.ts` traces the sets with `traceEngineRay` and gets every field's chief
  landing, parabasal and real-ray foci and its shifts at the four channels R, G, B, V to the bit on every benchmark
  configuration and the zoom's far end. A finite object, a folded path, no half field, no pupil, no launch and a launch
  behind the first surface are coded problems; focus-stations and folded have no curvature sets.
- **One decision of fields and lines for the sets, the ask and `lv`'s answer** (`curvatureFields.ts`:
  `lvCurvatureFields`, `lvCurvatureLines`, `lvCurvatureLine`): the R10b ask is at the lines LV's sections trace (the
  authored reference line, a chromatic channel's line), none for a run of no such line (every photopic run).
  `test/engines/lv/curvature.test.ts` feeds the asks of the fake's vector variant to `answerLvCurvature`, which answers
  every field.
- **R10a is gated, identical rays** (policy version 19): `rays.trace` of the curvature sets, `raysCurvatureComparator`,
  on the rays valid in both answers of a pair. A focus is `relativeFocus` (`src/estimators/fieldFocus.ts`), the least
  squares of a fan's coordinates relative to the chief ray's (`-Σ Δc Δu / Σ Δu²` from the case's plane, LV's
  `bestRelativeFocusPlane`), judged on the transverse scale: `tangentialFocus.maxScaled` and `sagittalFocus.maxScaled` =
  the focus difference times the larger of the two answers' RMS relative slopes, never one engine's
  (`raysCurvature.test.ts` holds both orders), each 1e-8 mm, with `landing.maxAbs` 1e-8 mm and `mask.mismatches` 0;
  `tangentialFocus.maxAbs`, `sagittalFocus.maxAbs` and `astigmatism.maxAbs` are shown, never judged. No floor. A fan's
  figure that is not measured names a reason of that fan alone. **The owner accepted this gate as implemented
  (2026-10-26).** The conditioning is stated, not gated away: a parabasal relative slope is about 0.01 mm over the
  focal length, so the plain focus is 2,000 to 80,000 times a landing's difference (1.20e-8 mm on the diffractive Canon
  RF 800 mm on rounding alone); the scaled figure is about `|δΔc + s δΔu|`, a slope difference amplified by the focus's
  distance `s` from the plane (≤ 0.38 mm on the benchmark). R10a is in the default rung selection and joins the rays
  baselines of benchmark, features, states and diffractive at the Phase 6 end refresh.
- **`relativeFocus` is a pure estimator** under the estimator rules: every difference, quotient, product and sum carried
  in two doubles and rounded once; ten carried rests, each mutation-checked red in `test/estimators/fieldFocus.test.ts`
  (closed forms to the bit; 5,200 series within a unit of the exact focus in whole numbers). An unavailable focus says
  why (`no-reference`, `no-rays`, `bad-ray`, `no-slope`, `out-of-range`). It is in no engine's closure.
- **`curvature.native` v1 (contract 1.0)**: a spec of `lines`, `maxFieldDeg` (below 180) and `fieldAnglesDeg` (each
  below 90); per line and field `chiefLandingMm` (null where an engine states none), `tangentialShiftMm`,
  `sagittalShiftMm` (z of the focus less the case's `imageZ`, + toward the image; both finite for ok, both null for
  unavailable), `sampling`. Schema, corpus, `validate.py` port and invariants change together.
- **`lv` answers `curvature.native` from the sections as they present them** (`src/engines/lv/curvature.ts`,
  `lv-field-curves`): `computeFieldCurvatureBundle` with the drawer's request (`lvChiefRequest`); at the authored line
  the field curves (shifts, `chiefImageHeight`; `sampling` the parabasal fraction, the rays landed, the paraxial Petzval
  shift, the real-ray shifts), at a channel's line the chromatic shifts with `chiefLandingMm` null and
  `sampling.indexMaxDelta`, a line of neither unavailable (`lv-no-channel-at-line`, `lv-mixed-reference`), an unusable
  field `lv-field-unusable`. Refused before LV is asked anything but readings of the lens: `line` (a line the case
  does not have, `linesBeyondCase`, decided before any line is read, as in `lv`'s `axial.native` and `chief.native`),
  `lines.not-traced`, `lines.mixed-reference`, `focus.off-design`, `object.finite`, `path.folded`; `fields.angles` once
  the sections said their fields (a test makes every other LV call throw).
- **optiland answers `curvature.native` with its own `FieldCurvature`** (`lvrtc_optiland/curvature.py`):
  `FieldCurvature(optic, wavelengths="primary", num_points=2)` on a fresh `field_optic` a field and line (robust
  aiming), read at the normalised field 1; every setting read back (class, points, wavelength, both methods' `delta`
  1e-5, the values' shape, then `verify_field` again), each with a deliberate fault in `test_curvature.py`, which also
  holds the foci of a sphere that is its own stop to Coddington's equations within 1e-6 mm. A focus that is no number is
  `no-focus`; a parabasal ray of the field that optiland's own retrace does not land is `parabasal-ray-lost`, the
  retrace being of the analysis's two batches in their own shape (`parabasal_batches`: the axis and the field, a pair
  each), on the same optic, so the robust aimer reuses its pupil maps and the rays are the analysis's, bit for bit
  (`test_curvature.py`); never warm the aimer first. The
  identifying landing is `spot.chief_landing`. Budget and FATAL are the MTF worker's; no paraxial refusal (robust real
  rays).
- **R10b is recorded, of `lv` and `optiland`, only where named** (`curvatureNativeComparator`): R9b's
  `classifyChiefField` sorts each field (R5's classes, `indices-differ`, then the landing, `chief-landing-unknown` where
  an answer states none), then `tangentialShift.maxAbs`, `sagittalShift.maxAbs`, `astigmatism.maxAbs`.
  `curvatureFactsOfRecorded` repeats the sorting: change it, `curvatureFactsOf` and `recorded` together. **Owner
  decisions (2026-10-26):** the 1e-5 mm landing limit stays; `tangentialShift.maxAbs`, `sagittalShift.maxAbs` and
  `astigmatism.maxAbs` have attention bands of 1e-5 mm (policy 19), so a pair with a figure above one is ATTENTION, as
  R8b's spherical figures are (`curvatureNative.test.ts` holds a field above and within each); R10b stays out of every
  baseline (`--rungs r10b`).
- **LV conventions found** (`docs/gotchas.md`, "Field curves"; owner's brief
  `docs/upstream/lensvisualizer-parabasal-pencil.md`, not filed): LV's parabasal pencil is 0.01 mm wide, so its foci are
  of a finite pencil, up to 5.72e-6 mm from optiland's infinitesimal pair (converging as the square of the height when
  LV's own rays are made smaller). **Owner decision (2026-10-26): no LV change; the 0.01 mm pencil is a documented
  convention of LV's**, which R10b records within its bands. Below one degree the pencil was centred on LV's paraxial
  chief ray (up to 2.31e-6 mm); since LV #925 (`5ba17c20c`) it is centred on the solved chief ray (the Sony FE 400 mm's
  foci there within 4.0e-8 mm of optiland's at `098c91ef6`). optiland's robust aimer, batched with the axis inside
  `FieldCurvature`, loses the Sigma 35 mm's edge pair at f/8 where the field alone converges: an optiland behaviour,
  held by the owner with the other upstream items.
- The adapter revisions of `lv`, `replay`, `wave`, `optiland` and `optiland-wave` moved; `ref`'s did not; LV's engine
  closure did not (`c866fbff`: the names are of modules already loaded). The recipe in `docs/REFERENCE.md`, "The Phase 6
  end refresh", names `r10a` beside `r7a`, `r8a` and `r9a`.

## Stage 6.6 vignetting and relative illumination

- **The vignetting sets are the rays LV's vignetting tab launches** (`CaseSource.vignettingRaySets`,
  `src/engines/lv/vignettingRaySets.ts`, the tab's setup, fields, beams and mapping in `vignettingFields.ts`), generated
  by `planJobs` after `confirmRaySets`, only for a rung that says `needsVignettingRaySets`, and recorded under
  `runs[].vignettingRaySets`; a case source without them is `vignetting-sets-unavailable`. **Since LV #925
  (`5ba17c20c`, Stage 6.6b) the tab traces each field's beam in two dimensions** with its MTF's own launch: the drawer's
  two radii, `{ method: "geometric", spectrum: "reference", focus: "design" }` and a support record of its own (the d
  line, no index resolver), `mtfTraceOptions` of that line (`lvVignettingSetup`); the fields are
  `max(ceil(halfFieldDeg / 3) + 1, 7)` at `uniformFieldFraction`, the axis first; each field's launch is
  `prepareMtfFieldLaunch` (none from a bounding sphere), its footprint `findMtfFieldFootprint`, its lattice
  `mtfLaunchGrid(footprint, 64)` (`LV_VIGNETTING_BEAM_CELLS`, the tab's `BEAM_GRID_CELLS`). One pattern, `beam`: a set a
  field and line, the same rays at every line: the cells the tab traces (of each row, the columns from the middle on,
  where `mtfMirrorSymmetric` lets it mirror the other half; every column otherwise), stated as a lattice of their own
  (`groups.lattice`, half the grid's columns), each weighing LV's bulk transmission at the line
  (`bulkTransmissionForTrace`, the tab's `w`); right after them the chief rays of the tab's image mapping, weight 0: the
  field's (`groups.chiefIndex` = the cells) and those `MAPPING_STEP_DEG` (0.01°) below and above it where the tab has a
  launch (`lvMappingChiefRays`). **The set holds the half the tab traces, never the whole lattice**: the lattice's
  columns are not mirror images to the bit (2,921 of 5,043 column pairs on the test's 14 configurations), so the other
  half's cells are not where the tab's mirrored rays start. Where the tab maps a field with ray tubes (its chief ray or
  both neighbours vignetted: copies of the beam's rays tilted by 1e-4 rad and traced without aperture checks, which no
  `rays.trace` request states) the field keeps its set and is the coded note `lv-tube-mapping` (`lvVignettingMapping`);
  9 fields of 1,308 catalog curves at `098c91ef6`, none on the benchmark. Every restated line has a canary (two Stage
  6.6 tests in `canaries.test.ts`). `test/integration/lv/vignettingRays.test.ts` traces the sets with `traceEngineRay`
  and the tab's options, counts them in the tab's own arithmetic (a mirrored cell twice, a running sum, the image area
  `(dh/dθ)(h / sin θ)` of the lit chief rays) and gets `computeVignettingCurve` to the bit on every benchmark
  configuration, the zoom's far end, the absorbing Laowa 105 mm STF and the Viltrox AF 14 mm f/4 Air (142 fields), whose
  two ray-tube fields it gets to the bit by restating the tubes itself (`tubeImageArea`) and tracing them with LV; and
  holds each beam's cells to the right half of LV's own MTF lattice of the field at 64 cells. A folded path, a finite
  object, no half field and no pupil are coded problems of the run, and so is a state the tab draws no curve of
  (`lv-outside-beam-model`: `mtfSequentialRefractivePath` or `mtfAxialImagePlane` false, the eight diffractive states
  among them; `lv-bounding-sphere-field`) and an axis without a beam (`no-axis-beam`); a field the tab plots dark
  (`chief-ray-failed`, `vignetted`) and a launch behind the first surface are coded problems of the field.
  focus-stations and folded have no vignetting sets.
- **One decision of fields and lines for the sets, the ask and `lv`'s answer** (`vignettingFields.ts`:
  `lvVignettingDecision`, `lvVignettingMapping`, `lvVignettingLines`): the R11b ask is of the fields with a beam, at the
  lines that trace the authored indices (`tracesAuthored`), none for a photopic or spectral run; `lv` answers each asked
  field from the tab's curve, a state with no curve at every field with the refusal's code (asked at the tab's own
  angles), and states `sampling.tubeMapping` of the same decision (`test/engines/lv/vignetting.test.ts`).
- **R11a is gated, identical rays** (policy version 20; its beam sets and `landing.maxAbs` policy version 21, Stage
  6.6b): `rays.trace` of the vignetting sets, `raysVignettingComparator`, a comparator of spans (`spanOf`: the beam sets
  of one line; every figure of a field is relative to the axis). A set that is no beam (no lattice, or its chief ray not
  right after the cells) is not comparable. Which rays got through is judged as R2 judges it (`mask.mismatches` 0). The
  weights are the request's, so on the rays ok in both answers every count and sum is the same bits in both: never
  compare transmitted fractions of the common rays. `transmission.maxAbs` is aligned with R2: the flux of the cells of
  `mask.mismatches` that one answer lets through and the other does not (never the rim band, never a failed ray) over
  the axis's on the common rays, on the launch plane (a count over a total: about 1/1600 a cell of a half lattice of 64
  across), gate 0; the flux of the rim-band and failed rays one answer passes and the other does not is shown beside it,
  never judged and in no policy, as R2 shows `mask.rimBand` (`transmission.rimBandOrFailed`, a subject of
  `transmission`, so a report puts it next to the gated column). `illumination.maxAbs` is each field's flux into the
  image over the axis's on the common rays (`cosineFlux` of the half lattice: the cut along the meridian is a rim of the
  lattice's own, of second order), gate 1e-9. The area of a beam in cosine space is of its rim (Green's theorem): an
  interior cell's direction enters to second order, a rim cell's `δ` by about `2 δ / ρ` (`ρ` 0.040 to 0.40 on the
  benchmark), so the gate is tighter than R2's direction gate, as R4's is; the conditioning is stated, never gated away,
  and a FAIL is attributed in extended precision first. `landing.maxAbs` is the largest landing difference, along x or
  y, of the chief rays of the image mapping ok in both answers, gate 1e-8 mm (R2's, R9a's and R10a's): the tab's image
  area is `(dh/dθ)(h / sin θ)` of these landings 0.01° apart, so its own figure moves by about `δ / (f · 1.75e-4)`
  relative to it for a landing difference `δ`, and the rung judges the landings themselves. No floor. A span's members
  are taken in an order of their own (`memberOrder`: the axis first, then by field angle, then by line) in `compare` and
  `recorded` alike, never the order handed over (a test reverses them and gets the same bytes). **The owner accepted
  these gates**: `mask.mismatches` 0, `illumination.maxAbs` 1e-9 and `transmission.maxAbs` 0 aligned with R2
  (2026-10-26), and `landing.maxAbs` 1e-8 mm (2026-10-27). R11a is in the default rung selection and joins the rays
  baselines of benchmark, features, states and diffractive at the Phase 6 end refresh (diffractive: no sets, its states
  being outside the tab's beam model).
- **The flux estimator (`src/estimators/illumination.ts`) is a pure estimator**: `blockFlux` (compensated sums of the
  weights taken), `launchArea` (cells taken times the step's square, carried in two doubles, rounded once) and
  `cosineFlux` (weight times `pupilFunction`'s cell area in optical direction cosines, compensated; the area does not
  depend on the path, so the paths it is handed are 0 and the path it forms is not read; no law of the field angle).
  Each carried rest has a test that a plain sum fails; the projected solid angle of a square stop seen from a field's
  image point is held to its closed form to second order in the cell, with the bound derived beside it
  (`test/estimators/illumination.test.ts`). Unavailable outcomes say why (`no-rays`, `bad-weight`, `no-flux`,
  `bad-line`, `bad-ray`, `degenerate-pupil`). It is in no engine's closure but `flux`'s; never in `lv`, `ref` or
  `replay`.
- **`vignetting.native` v1 (contract 1.0)**: a spec of `lines`, `maxFieldDeg` and `fieldAnglesDeg` (the first 0, the
  axis); per line and field `chiefLandingMm`, `geometricTransmission` and `relativeIllumination` (over the axis's, the
  engine's own measure, at least 0; both finite unless `unavailable`), `status` `ok`, `unconverged` (with a reason) or
  `unavailable`, `sampling`. Schema, corpus, `validate.py` port (`validate_vignetting_native`) and invariants change
  together.
- **`lv` answers `vignetting.native` from the tab as it presents it** (`src/engines/lv/vignetting.ts`,
  `lv-vignetting-tab`): `computeVignettingCurve` of the drawer's request (`lvChiefRequest`), each field's figures to the
  bit, identified by the landing on the design plane of LV's solved chief ray of the field
  (`chiefRayImageHeightAccurateForRuntimeLens`); `sampling` `gridCells`, `fieldSamples`, `mirrored` and `tubeMapping`.
  Refused before LV is asked anything: `line` (`linesBeyondCase`), `lines.not-authored-reference`, `focus.off-design`,
  `object.finite`, `path.folded` (a test makes every LV call throw); `fields.angles` once the tab's fields are known. A
  state the tab draws no curve of is every field unavailable with the code (`no-pupil`, `lv-outside-beam-model`,
  `lv-bounding-sphere-field`); an empty curve otherwise is `lv-no-curve` at every field.
- **`flux` is LV's lattices and the comparator's flux estimator** (`src/engines/lv/fluxEngine.ts`, `lattice-flux`), in
  the pattern of `wave`: `lvFieldRaySets` at 64 and 128 cells (`LV_FLUX_DEFAULT_GRID`, twice the run's default), or
  where a run states a `bundleGrid` at twice and four times it (R11b hands `flux` twice the stated grid as its option,
  so its coarser lattice is never the run's own; a run of more than 64 is `option.bundleGrid`, unsupported), each
  field's sets made once a field and lattice whatever line is asked, traced by `answerLvRays`; `geometricTransmission`
  the launch-plane area of the cells taken over the axis's, `relativeIllumination` the cosine flux over the axis's, on
  the finer lattice; `ok` only where both moved by no more than `CONVERGENCE_BANDS` on doubling and no lit cell is on
  the lattice's rim, else `unconverged` (`not-converged`, `convergence-unknown`, `lattice-edge-lit`). Its fingerprint is
  LV's. optiland has no vignetting analysis and answers no `vignetting.native`. **Owner decision (2026-10-27): `flux`
  keeps its cosine-space relative illumination** (Rimmer's method, OpticStudio's); R11b records LV's #925 energy route
  against it as two methods, and the owner decided that LV is to adopt Rimmer's method, and a vignetting curve of the
  share of stop samples transmitted, in later LV changes (pending).
- **R11b is recorded, of `lv` and `flux`, only where named** (`vignettingNativeComparator`): R9b's `classifyChiefField`
  sorts each field (R5's classes with `numerical` for `unconverged`, `indices-differ`, the landing at 1e-5 mm); no
  reason of its own. Figures: `geometricTransmission.maxAbs`, `falloff.maxAbs` (each answer's relative illumination over
  its geometric transmission, of no vignetting: since `5ba17c20c` the tab's energy route, its flux times cos θ over the
  chief rays' image mapping, against the cosine-space flux) and `relativeIllumination.maxAbs`.
  `vignettingFactsOfRecorded` repeats the sorting: change it, `vignettingFactsOf` and `recorded` together. **Owner
  decisions (2026-10-26):** the engine `flux` stays R11b's independent estimate, and its cosine-space flux (the
  projected solid angle of the exit pupil) is the comparator's relative illumination; the 1e-5 mm landing limit stays
  (policy 20); the three figures have no attention band; R11b stays out of every baseline (`--rungs r11b`).
- **LV assumptions found, resolved by LV #925** (`5ba17c20c`; `docs/gotchas.md`, "Vignetting"; owner's brief
  `docs/upstream/lensvisualizer-vignetting-sweep.md`, not filed): the tab's sweep was a chord of the axis's pupil, which
  the stop's image outgrows off the axis (the beam's area 1.79 times the axis's on the Sony FE 20 mm at f/8 and 47°,
  where the tab's fraction was 1.02); a chord overstates a vignetted beam's area (the Canon EF 135 mm's edge 0.484
  against 0.387); cos^4 of the object-space angle is no lens's falloff (the Z 24-70 mm at 70 mm, traced 0.641 against
  0.843 at 16.6°). Since `5ba17c20c` the tab traces each field's beam in two dimensions and takes its relative
  illumination by conservation of energy over the chief rays' image mapping (Stage 6.6b: the vignetting sets above; on
  the benchmark at `098c91ef6` R11b has all 232 fields of two methods and, per field off the axis, the geometric
  transmission within 0.0100 of the flux's (median 0.0017; up to 0.773 before), the relative illumination within 0.0110
  (median 0.0017; 0.273 before) and the falloff within 0.023 (median 0.00075; 0.202 before): the tab's energy route on a
  half lattice of 64 cells against the flux's cosine-space flux on a lattice of 128, two methods recorded). **Owner
  decision (2026-10-27)**: LV is to move the tab to Rimmer's relative illumination (the cosine-space flux, `flux`'s and
  OpticStudio's) and to a vignetting curve of the share of stop samples transmitted, and to aim its spots, fans, bokeh,
  zones and MTF at the real stop, in later LV changes (pending; the canaries of those lines will fail first).
- The adapter revisions of `lv`, `replay` and `wave` moved (the stage's names and modules); the kit's `validate.py`
  moved `optiland`'s and `optiland-wave`'s; `ref`'s did not; `flux` is new; LV's engine closure did not (`c866fbff`).
  The recipe in `docs/REFERENCE.md`, "The Phase 6 end refresh", names `r11a` beside `r7a` to `r10a`.
- **Stage 6.6b adopted LV #925** at `098c91ef6` (engine closure `fef2e248`, 178 files; the new names
  `computeOffAxisChannelFieldGeometry`, `mtfSequentialRefractivePath`, `mtfAxialImagePlane`, `mtfMirrorSymmetric`,
  `mtfTraceOptions`, `bulkTransmissionForTrace` and `launchSurfaceForFieldDeg` are of modules already loaded). The six
  canaries that failed restate LV's new lines (the gate's two rules, the anchored channels, the axis-only chief-ray
  shortcut and its tolerance, the per-channel lateral colour and its channels, the tab's beams and mapping); the MTF
  and R4f pins (`PINNED_CLOSURE` of `mtf.test.ts` and `fidelity.test.ts`) were measured again at `fef2e248` and found
  unchanged, case for case. The adapter revisions of `lv`, `replay`, `wave` and `flux` moved; `ref`'s and the optiland
  worker's did not. Policy version 21 (R11a's `landing.maxAbs`); baselines are still refreshed once at the end of Phase
  6, where R11a's beam sets are 1.7 times the rays compared of the sweeps and lattices they replace and 9.6 GB of the
  store compressed on the benchmark alone (`docs/REFERENCE.md`, "Stage 6.6b").

## Stage 6.7 summary and cardinal elements

- **The summary tab traces no ray of its own** (`computeOpticalSummary` of the drawer's request,
  `src/optics/analysis/summary/summary.ts`): its readouts are of the prepared state, LV's paraxial kernel and the hook.
  **They are covered by R1** (`test/integration/lv/summary.test.ts`, every reference-line state of benchmark, states and
  focus-stations at the design plane, 113 at `098c91ef6`, 61 finite): the cardinal focal length, the BFD (R1's
  `backFocus`), the FFD (the first vertex less R1's `frontFocalZ`), the hiatus (R1's `frontPrincipalZ` less its
  `rearPrincipalZ`), the image plane and the track (the case's) to the bit; breathing and telephoto ratio derived to the
  bit; the physical stop within two units in the last place of twice the case's (derived: a product and a quotient each
  rounded once). Two **measured margins**, held only at `PINNED_CLOSURE` and the cases of `MEASURED_CASES` (as
  `mtf.test.ts` pins), so a lens edit cannot turn `test:lv` red, and written down elsewhere: the current and infinity
  focal lengths within 8 units in the last place of R1's (measured 7, the Leica Summilux-C 18 mm at a focus station),
  the entrance pupil and the "Working f/#" within 1e-10 relative (measured 3.4e-11; the hook's pupil is of a real ray
  1e-4 mm from the axis, whose height over 1e-4 multiplies an absolute rounding by 1e4). Measure again and pin anew when
  the closure or the cases move; never loosen a margin without a measurement. Not covered, listed in the test
  (`NOT_COVERED_BY_R1`): the half field, the focus distance, the controls, the "Current Perspective Pose" section (shown
  only with an active pose; no case has one) and the aperture control's "eff. f/" (shown only above a 0.05 difference
  with `showEffectiveAperture` on).
- **No `r12a`** (decided with evidence; the owner accepted it, 2026-10-27): the hook's pupil ray 1e-4 mm from the axis
  matches R1's paraxial pupil to 3.4e-11 relative; a rung of its height at R2's 1e-8 mm would judge it to 1e-4 relative,
  about 10^6 times looser. The half field is the hook's analysis field geometry (`computeAnalysisFieldGeometry`, not
  the paraxial estimate of `computeFieldGeometry` alone): the field whose solved real chief ray lands at the image
  corner (half the stated image circle, or the format's diagonal) within 1e-4 mm on 103 of 113 states; the last field
  whose chief ray clears every aperture where one clips it short of the corner (one: the GF 80 mm's close station); the
  authored trace field (four), or one the corner lowered (five). R9a traces and judges the solved chief ray at that angle
  (the distortion curve's edge) at every infinity state; the angle is LV's solve, which no engine has.
- **`summary.native` v1 (contract 1.0)**: a spec of `lines`; per line `rearFocalZ` (what identifies the system),
  `focalLengthMm`, `entrancePupilDiameterMm`, `stopDiameterMm`, `imageSpaceFNumber` (|EFL| / EPD, OpticStudio's
  image-space F/#), `paraxialWorkingFNumber` (`1 / (2 n' |u'|)` of the paraxial marginal ray at the case's conjugate),
  `workingFNumber` (`1 / (2 n' sin θ')` of the real marginal ray), `nominalFNumber` (a mark, not computed),
  `totalTrackMm`, `halfFieldDeg`, each null where the engine states none under that definition: an estimate of another
  construction is null, and goes under `sampling` by a name of its own. Schema, corpus, `validate.py` port
  (`validate_summary_native`) and invariants change together.
- **`lv` answers from the tab and the aperture control as they present them** (`src/engines/lv/summary.ts`,
  `lv-summary-tab`): `lvSummaryRequest` restates the hook's `dynamicEFL` (`computeFocusEFL` of a request of the state,
  which reads nothing else) and the drawer's request (the hook's pupil for the case's stop, `lvPupilSeed`; the hook's
  stop, `lvSummaryStopSemiDiameter`: wide open its `currentPhysStopSD`, a unit from the case's on some lenses; its field
  geometry). The tab's "Working f/#" is `imageSpaceFNumber`; `paraxialWorkingFNumber` and `workingFNumber` are null (LV
  traces neither marginal ray for an f-number); the slider's marked f-number is `nominalFNumber` (`lvNominalFNumber`);
  the control's "eff. f/" (`effectiveFNumber`, bound from `optics.ts`), a thin-lens estimate of stored pupils, is
  `sampling.lvThinLensEffectiveFNumber`; `rearFocalZ` is `computeCardinalElementsFromState`'s. Refused before LV is asked
  anything: `path.folded`, `line`, `focus.off-design` (the case's plane is not the state's `imgZ`),
  `lines.not-authored-reference` (a test makes every LV call throw). Two canaries (Stage 6.7 in `canaries.test.ts`) hold
  the restated lines, the tab's labels, `analysisJobs.computeOpticalSummary`, the half field's corner rule and the stop
  sizing with its exceptions; the integration test holds `lv`'s answer to the tab asked with a request spelled out again
  (to the bit wide open, within two units stopped down: a case carries its stop, not the slider's N).
- **optiland answers with its own accessors** (`lvrtc_optiland/summary.py`): of a verified optic of the line
  `first_order.line_data`'s `F2()` and `f2()`, `|EPD()|`, the system aperture's value, `|FNO()|`, `1 / (2 n' |u'|)` of
  `marginal_ray()` (optiland has no accessor of it), `total_track`; `get_working_FNO` on the axis on a `field_optic`
  (robust aiming, the rim rays through the stop's clip radius); `nominalFNumber`, `halfFieldDeg` null. Its stop and
  track are read-backs of the case: their figures hold LV's tab to the case, not two engines to each other. `sampling`:
  `exitPupilDiameterMm`, `magnification` (finite object), `workingRimRaysVignetted` (`rim_ray_counts`: aimed rim rays
  dark first at a surface of the case other than the stop; one dark at the stop, clipped there by a rounding, or at the
  object or image surface is not counted, each exclusion with a test that turns red without it; optiland leaves a dark
  rim ray out and, all four dark, takes their angles all the same; the worker counts, never corrects),
  `workingFNumberUnaimed` under optiland's default paraxial aiming and `unaimedRimRaysLost`. Every setting read back
  (aperture type and value, wavelength, image-space index, where the marginal ray starts, both aimings), each with a
  deliberate fault in `test_summary.py`, whose expected values are an exact rational trace and 60-digit rim rays
  (`exact.py`; behind a lens the aimed rim ray by a 60-digit bisection). An afocal or object-telecentric system is a line
  `unavailable` with `first_order`'s item; a phase or a term of power 1 or 2 and a folded path are refused from the case.
  Budget and FATAL are the MTF worker's.
- **R12b is recorded, of `lv` and `optiland`, only where named** (`summaryNativeComparator`, policy 22): asked at the
  case's lines of `indexSource` "authored" of a case LV exported (`summaryNativeSpec` in `rungs.ts`, from the case
  alone; none of a photopic run or a case read from a file, as the other rungs about engines of their own). Each line
  sorted by R5's `classifyNativeField` with the rear focal point as the landing, then the differences of the values both
  state under one definition (`focalLength`, `entrancePupilDiameter`, `stopDiameter`, `imageSpaceFNumber`,
  `paraxialWorkingFNumber`, `workingFNumber`, `totalTrack`, each `.maxAbs`); one an answer never states is unmeasured
  with the engine named. The mark and the half field are recorded, never a figure. `summaryFactsOfRecorded` repeats the
  sorting. **Owner decisions (2026-10-27): accepted as proposed**: the sorting limit `rearFocus.maxAbs` 1e-5 mm;
  attention bands of 2e-9 on `imageSpaceFNumber.maxAbs` and 3e-9 mm on `entrancePupilDiameter.maxAbs` (ten times the
  measured 1.45e-10 and 3.0e-10, rounded up; `summaryNative.test.ts` holds a pair above each band ATTENTION and one
  within RECORDED), none on the others; R12b out of every baseline (`--rungs r12b`).
- **Measured** (`docs/REFERENCE.md`, "Stage 6.7"): benchmark 24, states 32, focus-stations 61 pairs RECORDED, no
  ATTENTION; one definition, one number: image-space f-numbers within 1.45e-10, pupils within 3.0e-10 mm, rear focal
  points within 2.0e-13 mm, stops within 7.1e-15 mm; `paraxialWorkingFNumber.maxAbs` and `workingFNumber.maxAbs`
  unmeasured.
- **LV assumptions found** (`docs/gotchas.md`, "Summary"; brief `docs/upstream/lensvisualizer-summary-conventions.md`,
  not filed): the tab's "Working f/#" is OpticStudio's image-space F/#, up to 4.8% below the real rim rays' working F/#
  at infinity and 1.03 against 4.75 at the Sigma 105 mm's 1:1; the stop is sized wide open by an unaimed, unclipped real
  ray at `EFL / (2 N)` (exceptions: an authored zoom stop schedule, a stop inside an element, a fixed iris, a fisheye's
  projection focal length, the paraxial height where the real ray fails; interpolated between zoom stations), so the
  mark is close to the working F/# there (within 0.34%), and scaled linearly stopped down, so a marked f/11 is up to
  4.95% faster (the Plena); the "eff. f/" is a thin-lens estimate of stored pupils, −8.5% to +58% from the paraxial
  working F/#; the stop's sizing ray is clipped by another surface on the Sigma 35 mm and the Canon EF 135 mm wide open
  and at 12 of 61 focus stations. **Owner decision (2026-10-27): LV is to adopt OpticStudio's three f-numbers under their
  names** (image-space f/# = EFL / EPD; the paraxial working f/# of LV's own paraxial trace at the current focus, in
  place of the thin-lens "eff. f/"; the working f/# of the real marginal ray, `1 / (2 n' sin θ')`) **and one stop rule
  at every N, the paraxial EPD = EFL / N** (OpticStudio's image-space F/# aperture), in place of the real sizing ray and
  the linear stop-down. The LV change is pending (the owner holds its prompt). Until it lands R12b records LV as it is;
  afterwards the canaries of those lines fail first, every case's stop radius moves (every case id and baseline record),
  and the summary's request, R12b's asks and the measurements are redone.
- The adapter revisions of `lv`, `replay`, `wave` and `flux` moved (the stage's names, of modules already loaded: LV's
  engine closure is unchanged, `fef2e248`), and the worker's files moved `optiland`'s and `optiland-wave`'s; `ref`'s did
  not. No gated rung joins the Phase 6 end refresh.

## Stage 6.8 Seidel sums, wavefront and Zernike fits

- **LensVisualizer presents no Seidel sums, wavefront or Zernike coefficients** (at `098c91ef6`: `mtfWaveLattice` and
  `waveLatticeOtf` are an MTF's internals no tab presents; the spherical-aberration primer's wavefront panel is a fixed
  drawing). The stage is optiland beside the comparator, by OpticStudio's conventions (the owner's principle,
  2026-10-27: match OpticStudio with ray aiming, and CODE V, wherever possible). No identical-ray rung, no `lv` answer.
- **`seidel.native` v1 (contract 1.0)**: spec `line`, `maxFieldDeg` (0 to below 90: OpticStudio's maximum field, H = 1),
  optional `dispersionLines` (two lines, the shorter wavelength first); answer `invariant` (the Lagrange invariant
  `n (u_chief y_marginal - u_marginal y_chief)`, mm: what identifies field and aperture), `surfaces[]` and `total` of
  OpticStudio's SPHA, COMA, ASTI, FCUR, DIST, CLA, CTR in mm (each null where none is stated), `status`/`reason`,
  `sampling`. Welford's sums of the paraxial marginal ray through the stop's rim (+stopSemiDiameter) and the chief ray of
  object-space slope `tan(maxFieldDeg)` through the stop's centre; OpticStudio's sign (S1 > 0 undercorrected); an
  asphere's conic and term of power 4 enter through `b = ((1 + K) c0^3 - c^3) / 8 + a4`; a term of power 1 or 3 has no
  sums. OpticStudio's wave coefficients (`W040 = SPHA / 8 lambda`, `W131`, `W222`, `W220P = FCUR / 4 lambda`, `W311`,
  `W020`, `W111`) are formed by the comparator (`recorded`), never stated by an engine. Schema, corpus, invariants and
  `validate_seidel_native` change together.
- **`ref-seidel` is the reference engine's model and the comparator's sums** (`src/engines/refSeidel`), an engine of its
  own so that `ref`'s fingerprint (the files of `src/engines/ref`) and adapter revision (its module's closure), which the
  rays baselines hold, do not move: it imports `ref`'s model, paraxial kernel and fingerprint, `ref` imports nothing of
  it (`seidel.test.ts` holds the closures apart). Its fingerprint is of both directories. Written from the optics alone,
  only basic operations (`tanDegrees` a series on a reduced argument), each sum that can cancel within a surface formed
  with the product's rounding carried, the totals compensated. Its proofs are analytic
  (`test/engines/refSeidel/seidel.test.ts`): `tan` against a whole-number series, a single surface's closed forms, S1 as
  the limit of a real ray's longitudinal aberration, an aplanatic surface, a surface centred on the stop, a thin lens,
  the Petzval sum, a plane-parallel plate, a Cartesian ellipsoid, a fourth-order plate, a paraboloid of a term of power 2,
  the stop-shift identities, the colour of a thin achromat. Never port optiland's sums into it.
- **optiland answers `seidel.native` with its own `aberrations`** (`lvrtc_optiland/seidel.py`) of a verified optic whose
  one field is `maxFieldDeg` (`field_optic`): totals the negated `seidels()`, a surface's the negated `third_order()` term
  times optiland's own factor `2 n' u'`, held to the total (`SURFACE_SUM_TOLERANCE`), the invariant the negated
  `paraxial.invariant()`: optiland's sign is OpticStudio's opposite on all five (its own cross-tool test says so). Its
  sums read a surface's radius and conic alone: a term of power 3 or 4 is refused (`surface.asphere.cubic-term`,
  `surface.asphere.quartic-term`, `seidel.term_refusals`), as are a phase profile and a term of power 1 or 2. It states
  no chromatic sum (its optic of a line has one wavelength of a constant index; the owner may decide on a dispersive
  optic). Every setting read back (aperture, wavelength, image index, largest field, surface count, marginal start,
  chief slope within 4 ulp of `tan`, chief height at the stop, `third_order()`'s total), each with a deliberate fault in
  `test_seidel.py`, which holds the worker's sums to a single surface's closed forms and pins optiland's raw sign and its
  blindness to a term of power 4.
- **`zernike.native` v1 (contract 1.0)**: spec `line`, `fieldAnglesDeg`, `grid` (even: `wavefront.native`'s midpoints),
  `ordering` (`standard`: OpticStudio's Zernike Standard, Noll's index, unit RMS; `fringe`: OpticStudio's Fringe, 37 at
  most, the 37th `(12, 0)`), `terms` (1 to 231); per field `imageHeightMm` (the landing that identifies it),
  `coefficients` (piston and tilt kept), `rmsToChiefWaves` (about the mean), `pvToChiefWaves`, `fitResidualRmsWaves`,
  `fitCondition` (`||G||_1 ||G^-1||_1` of the normal equations), `validSamples`. W is OpticStudio's OPD sign (chief's path
  less the ray's, vacuum waves), about the chief ray's reference sphere, in optiland's frame (the case's mirrored in y),
  unit circle the stop under robust aiming. Schema, corpus, invariants and `validate_zernike_native` change together.
- **optiland answers `zernike.native` with its own `ZernikeFit` of its `Wavefront` samples** (`lvrtc_optiland/zernike.py`):
  `wavefront_sample` (the refactored read-back path of `wavefront.native`, unchanged in what it returns) of one field and
  grid, then `ZernikeOPD`'s two steps on that grid (`ZernikeOPD` takes a hexapolar grid only: `test_zernike.py` holds the
  two steps to it bit for bit). OpticStudio's Standard is optiland's `noll` (its `standard` is OSA/ANSI); its Fringe 37th
  polynomial is `(6, 6)`: a Fringe fit of 37 terms is refused (`zernike.fringe-term-37`). The fit is read back (type,
  class, terms, points, coordinates and values bit for bit, every `(n, m)`, the coefficients' count), each with a fault.
  RMS, peak to valley, residual (of optiland's `zernike.poly`) and condition (numpy's `cond(G, 1)` of optiland's own
  polynomials) are the worker's, stated as such (`OPD.rms()` keeps the piston); a condition of 2^52 or more is
  `unavailable` (`ill-conditioned`), and fewer valid samples than terms `too-few-samples` (`TooFewSamples`, before
  optiland is asked, as `optiland-wave` says it). `test_zernike.py` holds a Fringe fit to its exact least squares in
  fractions.
- **`optiland-wave` also answers `zernike.native`**: one `wavefront.native` request of the spec's line, angles and grid,
  validated and held to what was asked, then the pure estimator `src/estimators/zernike.ts` (compensated normal
  equations, Cholesky, two refinements; `normalCondition`; `ill-conditioned` at 2^52, `degenerate-fit` where Cholesky
  fails). Its proofs are analytic (`test/estimators/zernike.test.ts`): orderings from their definitions, radial
  polynomials by Gram-Schmidt in fractions, norms by the exact disc integral, values at dyadic points, parity zeros on
  the grid, recovery of known polynomials, pure defocus and spherical aberration, RMS with a piston of 2^30, the exact
  condition and the strips that leave no digit. The estimator is in no engine's closure but `optiland-wave`'s.
- **R13b and R14b are recorded, only where named, out of every baseline** (policy 23): R13b of `ref-seidel` and optiland
  (`seidelNativeSpec`: line 0, the recipe's largest field angle, the shortest and longest lines as dispersion lines),
  sorted by R5's `classifyNativeField` with the invariant as the landing (`invariant.maxAbs`), figures each total's
  `.maxAbs`, `total.maxScaled` (over the larger sum of the surfaces' magnitudes) and `surfaces.maxAbs`; R14b of optiland
  and `optiland-wave` (`zernikeNativeSpecs`: line 0, the recipe's angles, grid 128, Standard 37 and Fringe 36), sorted by
  R5's classes with `chiefLanding.maxAbs` and, as numerical (R5's `unconverged`), by `fitCondition.max`; figures
  `coefficients.maxAbs`, `rmsToChief.maxAbs`, `pvToChief.maxAbs`, `fitResidualRms.maxAbs`, counts of fields.
  `seidelFactsOfRecorded` and `zernikeFactsOfRecorded` repeat the sortings: change them with `recorded`. **Policy 23
  states units and no limit or band**: the owner's to set (proposals in `docs/REFERENCE.md`, "Stage 6.8": R13b
  `invariant.maxAbs` 3e-14 mm, a band of 8e-15 on `total.maxScaled`; R14b `fitCondition.max` 1e6, `chiefLanding.maxAbs`
  1e-9 mm, bands 4e-11 waves on `coefficients.maxAbs`, 2e-16 on `rmsToChief.maxAbs`, 7e-16 on `fitResidualRms.maxAbs`).
- **Measured** (`docs/REFERENCE.md`, "Stage 6.8"; 36 design-plane runs of the benchmark and the features suite): R13b 18
  pairs of two methods, totals within 2.6e-15 mm, scaled 7.2e-16, invariants within 2.7e-15 mm, 36 refused by optiland
  (a term of power 3 or 4); R14b 360 fields, RMS within 1.4e-17 waves, peak to valley to the bit, coefficients within
  3.0e-12 waves below a condition of 1e6 and up to 1.29 waves on the Sigma 35 mm's full field (condition 1.4e13, a
  vignetted strip of the pupil: `docs/gotchas.md`, "A Zernike fit of a vignetted field is ill-conditioned"). Two optiland
  workers a slot peaked at 2.31 GiB, within the 2.5 GiB estimate (`jobEstimateGiB` unchanged).
- **Not covered**: `ref` as a third Zernike answer (`wavefront.native` v1 carries no launch rays; a v2 with them, or
  `ref`'s own aiming, would make one: the owner's), optiland's chromatic Seidel sums, OpticStudio's "to centroid"
  figures, LensVisualizer (no tab). `reports/benchmark/validation-matrix.md` does not exist; what it needs is in the
  REFERENCE (due with the end refresh).
- The adapter revisions of `optiland` and `optiland-wave` moved (worker files, the kit's `validate.py`, the estimator);
  `lv`, `ref`, `replay`, `wave` and `flux` did not (no file of their closures changed); `ref-seidel` is new. No gated
  rung joins the Phase 6 end refresh.
