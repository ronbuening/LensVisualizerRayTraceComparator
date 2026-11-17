# Contributing

Developer material, moved here from the README as it was: concurrency and the result cache, the test tiers and npm
scripts, the real-engine check, store upkeep, and the commands behind every comparison. Reviewers start with the
[README](README.md). The working rules for changes are in [CLAUDE.md](CLAUDE.md); the plan, with its phases and the
comparison of engines step by step, is [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md).

## Writing an engine

Every engine speaks one message format, [contract/CONTRACT.md](contract/CONTRACT.md), in process, over standard
input and output, a process per message, or as files a person operates. How an engine is configured, and how the
Python worker kit (`workers/python/lvrtc_worker_kit`, standard library only) answers, is in
[docs/REFERENCE.md](docs/REFERENCE.md). `node bin/lvrtc.mjs engine conformance <id>` holds an engine to the format;
`test/fixtures/fake-root` defines the fake engines the tests use.

## Profiling

`LVRTC_PROFILE_DIR=<temporary directory>` records per-process phase timings and peak memory, outside the results of
a run. See `docs/REFERENCE.md`.

## Commands

Suite commands accept `--jobs <n>`: `run`, `compare`, `baseline check`, and `mtf --profile benchmark`. The default is
`--jobs 1` (serial). The ceiling is the smaller of available parallelism and the memory allowance:
`--memory-budget <GiB>` (default: 25% of installed RAM minus 2 GiB) divided by 2.5 GiB/job, or 4 GiB/job
when the suite's selected checks include `mtf-vs-optiland-wavefront` and its two Python workers. An overlarge value
is a usage error. On a 48 GiB machine the default is 10 GiB: at most 4 jobs, or 2 with `mtf-vs-optiland-wavefront`. Choose a smaller budget if other
applications need more memory. Higher values move case/ray preparation and engine/store work into at most n persistent children.
The pool pauses new dispatches while child-plus-worker RSS exceeds the budget and resumes when it falls;
running jobs finish normally. `LVRTC_PROFILE_DIR` records per-process and combined RSS peaks outside results.
Comparisons use at most n threads, each processing an independent run and keeping the order of its checks, so that
a check whose earlier check failed is still not judged. Persisted results and
job order are identical to serial execution. New store entries use gzip; existing plain entries remain readable.

```bash
node bin/lvrtc.mjs run suites/features.json --checks built-system,first-order,ray-trace,optical-path,geometric-mtf --jobs 2
node bin/lvrtc.mjs compare features --jobs 2
node bin/lvrtc.mjs baseline check features --jobs 2
node bin/lvrtc.mjs mtf nikkor-z50f12 --profile benchmark --jobs 2
node bin/lvrtc.mjs store compress          # maintainer only: dry run, file counts and bytes before/after
node bin/lvrtc.mjs store compress --yes    # maintainer only: atomically compress legacy entries
node bin/lvrtc.mjs store prune             # maintainer only: dry run, unused engine-version files and bytes
node bin/lvrtc.mjs store prune --yes       # maintainer only: remove entries unused by any committed baseline engine
```

Maintenance uses the configured runs directory. Pruning protects exact engine/fingerprint/adapter tuples from
Git HEAD's committed baselines, so the answers of engines whose baselines are not yet rewritten and committed
are removable: prune after a baseline refresh is committed. Run maintenance with no other store writer. See [the reference](docs/REFERENCE.md#stage-51-throughput-and-store-maintenance).

### Check the code

```bash
npm run check
```

Runs the type check, lint, format check, the TypeScript tests and the Python tests of the worker kit. It needs
neither LensVisualizer nor optiland. Run it before every commit. Hermetic test files use concurrency 4;
`npm run test:lv` and `npm run test:optiland` use `--test-concurrency=1`. Run one heavy command at a time,
including across agents: never overlap tiers, suites or pool tests. Real-engine runs use at most `--jobs 4`,
subject to the lower memory ceiling.

```bash
npm run test:lv
```

Runs the tests that need the real LensVisualizer checkout. They are not part of `npm run check`; each skips,
saying why, when LensVisualizer is not configured. They write nothing into LensVisualizer.

```bash
npm run test:optiland
```

Runs the tests that need the real optiland, with the interpreter of `engines.optiland.python`. They are not part
of `npm run check` either, skip the same way, and prove that nothing was written into the optiland checkout. The
tests that set optiland against LensVisualizer need both.

```bash
npm run verify:real                 # the benchmark, rays then MTF
npm run verify:real -- --suite features   # one suite, rays then MTF
npm run verify:real -- --all        # every routine committed suite, one after the other (not the catalog)
```

The real-engine check: holds the committed baselines to the live LensVisualizer and optiland. It runs
`lvrtc doctor` first and refuses (exit 2) when either engine cannot be used or LensVisualizer's checkout is dirty
or not under git; then `lvrtc baseline check` of each baseline in turn, each in a process of its own, never two at
once, with at most `--jobs 4` (default), fewer where the memory budget says so (two for the benchmark's MTF, which
has `mtf-vs-optiland-wavefront`). It exits 0 only when every record is `OK`, `REFRESHABLE` or `MOVED`, prints a line per suite and kind,
and writes nothing into `baselines/` or `reports/`. On the warm store the benchmark takes minutes; from an empty
one its MTF check takes many hours, so a cold check is better run on `--suite features`. Set `LVRTC_RUNS_DIR` to
keep a trial off the repository's store ([measured](docs/REFERENCE.md#stage-54-the-real-engine-check)). The
catalog's baselines are a dated snapshot, not refreshed until the project's end: `--all` leaves them out, and
`--suite catalog` checks them only when asked.

### Look at LensVisualizer's lenses

```bash
node bin/lvrtc.mjs lenses list
```

Lists every lens of the LensVisualizer catalog: key, name and file.

```bash
node bin/lvrtc.mjs lenses show nikkor-z50f12
```

Prints one lens as LensVisualizer prepares it for tracing: a row per surface, with whether its rim clips, the stop
and its radius, and the image plane. Add `--zoom 1` for the tele end of a zoom.

```bash
node bin/lvrtc.mjs export nikkor-z50f12 --aperture f/2.8 --lines photopic --out /tmp/z50.case.json
```

Writes one lens in one state as an optical case, the document every engine is asked about. What a case cannot
express, such as a mirror or a diffractive surface, is refused with a reason code and never approximated. A cover
glass or filter whose prescription publishes no rim is exported as LensVisualizer traces it, as a plate that
clips no ray.

```bash
node bin/lvrtc.mjs export --all --census reports/census
```

Exports every lens, every zoom at both ends, and rewrites the committed [census](reports/census/lv-export.md):
how many states export, and the lens keys that do not, by reason.

### Compare engines

```bash
node bin/lvrtc.mjs run suites/benchmark.json --engines lv,reference-tracer --checks built-system,first-order,ray-trace,optical-path
```

Runs a suite: for every lens, check and engine it asks the engine and stores the answer. Stored answers are reused,
so a run that was interrupted resumes by being run again. `--engines` and `--checks` are optional.

```bash
node bin/lvrtc.mjs run suites/benchmark.json --engines lv,reference-tracer,optiland --checks built-system,first-order,ray-trace,optical-path
```

Adds optiland: it builds every lens in optiland and reads the built system back (`built-system`), so a translation
error shows before a ray is traced, gives optiland's own focal length, cardinal points and pupils (`first-order`),
and traces the very rays LensVisualizer launches with optiland's own tracer: where they go (`ray-trace`) and how
long their paths are (`optical-path`). What comes of it is in [docs/REFERENCE.md](docs/REFERENCE.md#phase-2-r0-to-r3-on-three-engines).

```bash
node bin/lvrtc.mjs run suites/benchmark.json --engines lv,reference-tracer,optiland --checks ray-trace,optical-path,geometric-mtf
```

Adds the geometric MTF of those rays (`geometric-mtf`): one calculation, this tool's own, on where each engine
lands the rays of a field, at every wavelength of the lens and at the frequencies of LensVisualizer's MTF. It
traces nothing that `ray-trace` and `optical-path` have not traced.

```bash
node bin/lvrtc.mjs run suites/benchmark.json --checks lv-mtf-replay
```

Holds LensVisualizer's own geometric MTF to this tool's calculation on a replay of LensVisualizer's sampling
(`lv-mtf-replay`): the same rays, the same grids, the same counts. It is asked of two engines of its own, `lv` and
`replay-of-lv-mtf`, whatever `--engines` names, and takes about three minutes on the benchmark.

```bash
node bin/lvrtc.mjs run suites/benchmark.json --engines lv,reference-tracer,optiland --checks wave-mtf
node bin/lvrtc.mjs run suites/benchmark.json --checks mtf-vs-wave-estimate
```

The wave MTF. `wave-mtf` applies this tool's wave MTF calculation to each engine's trace of the same rays, on a
lattice twice as fine as the run's own, which it traces for that (about 8 minutes and 15 GB of the result cache on
the benchmark); a field whose lattice does not sample the wavefront, or has not converged, is reported and not
judged. `mtf-vs-wave-estimate` sets LensVisualizer's own diffraction MTF beside that calculation on
LensVisualizer's rays: two engines of its own, `lv` and `wave-mtf-of-lv-rays`, side by side with no limit (about 13
minutes).

```bash
node bin/lvrtc.mjs run suites/benchmark.json --checks mtf-vs-optiland-fft
```

`mtf-vs-optiland-fft` sets three engines' own diffraction MTF side by side: LensVisualizer's product MTF (`lv`),
optiland's FFT MTF (`optiland`) and this tool's wave MTF of LensVisualizer's rays (`wave-mtf-of-lv-rays`). It is run
only where it is named, since it needs optiland, and has no limit; a run whose figures are outside their review band
asks optiland once more, at 512 rays. About 8 minutes on the benchmark. A photopic run has no optiland row: its FFT
MTF is of one wavelength.

```bash
node bin/lvrtc.mjs run suites/benchmark.json --checks geometric-mtf-vs-optiland
```

`geometric-mtf-vs-optiland` sets three engines' own geometric MTF side by side: LensVisualizer's (`lv`), optiland's
own (`optiland`) and this tool's calculation on a replay of LensVisualizer's sampling (`replay-of-lv-mtf`), one
request a field. Run only where it is named, with no limit; a field at one wavelength that is outside its review
band asks optiland once more, at 512 rays. A photopic run has an optiland row: the rays are optiland's and the sum
over the wavelengths the worker's, and the report says so. About 37 minutes on the benchmark, most of it two fast
lenses wide open at full field.

```bash
node bin/lvrtc.mjs compare benchmark
```

Compares the stored answers of that run and gives each pair of engines a verdict per check. It exits 1 when a
pair is `FAIL` or `ERROR`.

```bash
node bin/lvrtc.mjs report benchmark
```

Writes `runs/benchmark/report.md`: every run, check and pair, with where each largest difference occurs.

### Baselines

```bash
node bin/lvrtc.mjs baseline write benchmark
```

After the three-engine `run` and `compare` above: rewrites the committed record of what the engines agreed on,
[baselines/benchmark.json](baselines/benchmark.json), and the report rendered from it,
[reports/benchmark/rays.md](reports/benchmark/rays.md). The same three commands with `features` rewrite the
feature suite's. That sequence regenerates everything that is committed under `baselines/` and `reports/` except
the census.

```bash
node bin/lvrtc.mjs baseline check benchmark
```

Runs the suite again on the baseline's engines and says, record by record, whether the baseline is still of the
lenses and engines at hand: `OK`, `STALE` (a lens or an engine has changed; `REFRESHABLE` if the figures still
hold) or `DRIFT` (a verdict changed or a figure moved past its limit). Only `DRIFT`, `FAIL` and `ERROR` exit 1.

```bash
node bin/lvrtc.mjs run suites/benchmark.json --engines lv,reference-tracer,optiland --checks geometric-mtf,lv-mtf-replay,mtf-vs-optiland-fft,geometric-mtf-vs-optiland,wave-mtf,mtf-vs-wave-estimate
node bin/lvrtc.mjs compare benchmark
node bin/lvrtc.mjs baseline write benchmark --mtf
node bin/lvrtc.mjs baseline check benchmark --mtf
```

The MTF baseline is a record of its own, [baselines/benchmark.mtf.json](baselines/benchmark.mtf.json), with its
report [reports/benchmark/mtf.md](reports/benchmark/mtf.md): the MTF checks held to a limit with the number of
fields each figure was judged on, the side-by-side checks, every row worth a look, and the engines' own MTF side by
side. From an empty result cache the run takes about an hour and 15 GB; the check answers from the cache what has
not changed, and says of a side-by-side check what `MOVED`, which fails nothing.

```bash
node bin/lvrtc.mjs verify
```

Needs no engine and is part of `npm run check`: validates every committed baseline and makes the committed
reports anew from the baselines, failing on a byte of difference. It cannot see a lens that has changed;
`baseline check` does.

```bash
node bin/lvrtc.mjs engine conformance reference-tracer
```

Checks that one engine speaks the contract correctly, whatever way it is reached.

```bash
node bin/lvrtc.mjs engine conformance optiland
```

The same for optiland: it starts the Python worker with the configured interpreter, which takes a few seconds.

### LensVisualizer's own MTF

```bash
node bin/lvrtc.mjs mtf nikkor-z50f12
```

Prints the MTF that LensVisualizer's MTF tab shows for the lens, asked exactly as the tab asks: sagittal and
tangential at 10 and 30 cycles/mm for each field, the focus shift, and the traced f-number.

```bash
node bin/lvrtc.mjs mtf nikon-z-24-70f4s
```

For a zoom, prints two tables: the wide end and the tele end. `--zoom <t>` asks for one position only, and
`--aperture f/8` for the tab's f/8 comparison.

### The MTF comparison of one lens

```bash
node bin/lvrtc.mjs mtf nikkor-z50f12 --profile benchmark --engines lv,reference-tracer,optiland
```

Does for one lens what the MTF benchmark does for twelve: the lens wide open and at the tab's f/8, at its design
plane and at LensVisualizer's best focus, at the reference wavelength and in white light (eight runs; a zoom at
both ends, sixteen), run on the named engines and compared. It prints the MTF report of that run: the checks held to
a limit, `geometric-mtf`, `lv-mtf-replay` and `wave-mtf`, with their worst figures, the side-by-side checks
`mtf-vs-wave-estimate`, `mtf-vs-optiland-fft`, `geometric-mtf-vs-optiland` and `mtf-vs-optiland-wavefront`, and the
engines' own MTF side by side at fields 0, 0.5 and 1 and 10, 30 and 50 cycles/mm. Progress is on the error stream; a
fast lens wide open takes minutes, and what the result cache already holds is not computed again. `--aperture f/8`
or `wide-open` keeps one aperture; without `optiland` among the engines the three checks against optiland are left
out. `--profile tabs` runs the same conditions with the checks of LensVisualizer's other tabs.

## Suites

A suite is a list of lenses and the states to compare them in. A zoom with no stated position is compared at
both ends.

| Suite | Holds |
|---|---|
| `suites/smoke.json` | two small primes and one small zoom |
| `suites/benchmark.json` | the 12 benchmark configurations, each on its reference line and on the photopic lines |
| `suites/features.json` | one lens for each kind of surface or aperture the benchmark lacks |
| `suites/states.json` | slider f/5.6 and f/11, and the benchmark zoom at its published stations; the checks held to a limit |
| `suites/focus-stations.json` | LV-certified finite focus stations selected at runtime; the checks held to a limit |
| `suites/folded.json` | the mirror and catadioptric lenses; `built-system` to `optical-path` |
| `suites/diffractive.json` | the lenses with a diffractive surface; `built-system` to `optical-path` |
| `suites/catalog.json` | every catalog lens, a zoom at both ends, wide open; the checks held to a limit (maintainer only; old ids) |

The focused suites use `lv,reference-tracer,optiland`. See [Stage 4.4](docs/REFERENCE.md#stage-44-focused-state-matrix)
for their states, measurements and the maintainer's separate rays/MTF baseline commands.

## The checks

`lvrtc checks` lists every check and `lvrtc checks <id>` shows one with its limits from the limits file at hand. The
foundation and MTF checks:

| Check (old id) | Compares | Limit |
|---|---|---|
| `built-system` (R0) | the system each engine built: vertices, shapes, apertures, indices, sag | equal; sag to rounding |
| `first-order` (R1) | focal length, focal and principal points, back focus, pupils | 1e-9 mm |
| `ray-trace` (R2) | the same rays in every engine: hits, exit direction, landing, which rays pass | 1e-8 mm; 1e-9 in direction; no ray passing in one engine only |
| `optical-path` (R3) | optical path of those rays | 2e-5 waves |
| `geometric-mtf` (R4) | geometric MTF of the same rays | 1e-7 |
| `lv-mtf-replay` (R4f) | replay of LensVisualizer's geometric MTF sampling | 1e-9; equal sampling and field statuses |
| `mtf-vs-optiland-fft`, `geometric-mtf-vs-optiland` (R5, R5g) | the engines' own diffraction and geometric MTF | side by side; review bands 0.005 on axis, 0.01 off axis |
| `wave-mtf` (R6a) | wave MTF of the same rays where the lattice can arbitrate | 2e-8 |
| `mtf-vs-wave-estimate` (R6b) | LensVisualizer's diffraction MTF beside the wave estimate of its rays | side by side; review bands 0.005 on axis, 0.01 off axis |

Verdicts are `PASS`, `FLOOR` (a pass under a limits file's numerical-floor rule), `FAIL`, `BLOCKED`, `UNSUPPORTED`,
`ERROR`, `RECORDED` and `ATTENTION`; the README gives the label each is shown as. The limits file gives no check or
figure a floor: a pair above its limit is `FAIL`. The floor machinery remains available to a future limits file.

### Older ids

The checks were renamed in Stage 9.7 and the engines this tool builds in Stage 9.8; the old and new ids are in
[CLAUDE.md](CLAUDE.md#identifiers) and [docs/REFERENCE.md](docs/REFERENCE.md#identifiers). Files written before the
rename keep their ids (the catalog's baselines and reports, `docs/known-failures.json` and its `--rungs`
reproducers, `suites/catalog*.json`, `contract/fixtures`, old run directories); lvrtc reads an old id as the new one
with one note per command, until the end-of-project catalog refresh rewrites them. `lvrtc glossary r2` says what an
old id is now. Write new suites, scripts and commands with the new ids and `--checks`.

## More

- [docs/REFERENCE.md](docs/REFERENCE.md): every command's options and exit codes, the engines, the checks with
  their measured results, configuration and workers.
- [contract/CONTRACT.md](contract/CONTRACT.md): the engine-neutral contract every engine speaks.
- [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md): the phases, stages and comparison ladder.
- [docs/gotchas.md](docs/gotchas.md): what an engine does that a comparison has to know about.
