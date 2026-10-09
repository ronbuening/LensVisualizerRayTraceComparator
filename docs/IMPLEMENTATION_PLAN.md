# LensVisualizer Ray-Trace Comparator — Implementation Plan

## Context

LensVisualizer (LV) has never had a real lens traced by other code. Its `MTF_ACCURACY_PLAN.md` sketches an
"External Cross-Check Tool (optiland)" inside LV; this plan builds that tool as a **standalone application** in
`Comparator/LensVisualizerRayTraceComparator` (empty repo today). It translates LV prescriptions for an external
engine, runs that engine to a given specification, and compares the results with what LV presents. MTF is first;
the same machinery then extends to rays, optical path, spots, distortion, field curvature, colour and vignetting.
optiland is the first engine; others must plug in later by different connection methods, compared individually or
as a group.

User decisions: TypeScript core on Node 24.15; CLI + JSON + deterministic Markdown reports first, dashboard later;
optiland interpreter set in a gitignored local config (default: the optiland checkout's `.venv`). optiland cannot be
changed. LV changes are a last resort — **none is required by this plan**.

## What the research established

Read-only probes rebuilt the benchmark lenses in optiland from LV's prepared state. No files were written and no LV
change was needed.

| Quantity | Measured | MTF-plan rung |
|---|---|---|
| Surface sag, LV vs optiland (incl. A18) | ≤ 1.8e-15 mm | — |
| EFL, focal point, back focus, pupil z (LV paraxial kernel) | ≤ 6e-13 mm on all 12 configurations | 1e-9 |
| Same rays in both engines, per-surface hit | ≤ 2.3e-9 mm | 1e-8 mm |
| Exit direction cosines | ≤ 9.3e-11 | — |
| Clipped/passed agreement | 0 mismatches in 5,832 rays | — |
| Optical path | ≤ 5.0e-6 waves | 2e-5 waves |
| Geometric MTF on identical rays | ≤ 1.24e-8 (3 lenses) | 1e-7 |
| Replaying LV's MTF sampling from exported rays | exact on 240 field-runs | — |
| LV diffraction vs optiland `ScalarFFTMTF` | 0.0035 (Canon 135/2), 0.0066 (Sigma 45/2.8), **0.043 (Z 50/1.2)** | recorded |

Consequences that shape the design:

- **LV runs headlessly from this repo today**: Node 24 type stripping plus a `.js → .ts` resolve hook, then dynamic
  import by file URL. All lens files build in under 2 s.
- **Translation must use optiland's Python API.** Its `.zmx` reader keeps 8 asphere terms and drops clip apertures.
- **The MTF plan's "inject our rays and run `ScalarFFTMTF`" is impossible**: optiland's FFT/Huygens classes trace
  their own pupil grid. Rays can be injected only at the surface level (`RealRays` + `optic.surfaces.trace`).
- **Anything that must agree is computed by the comparator** from each engine's raw rays. optiland's `GeometricMTF`
  is a histogram and cannot reach 1e-7; one estimator applied to both engines' landings does.
- **`ScalarFFTMTF` cannot be an asserted reference.** On the Z 50/1.2 it is unconverged at 512 rays, its off-axis
  tangential offset does not shrink with sampling, and one failing field raises for every field in the call.
- **optiland is monochromatic with no MTF focus search, and returns only a modulus.** LV's default view (photopic,
  best-axial focus) must be assembled per wavelength by the comparator with LV's indices, weights and focus shift.
- **LV's stored pupil constants and nominal pupil are not paraxial values.** `epZRelStop`, `xpZRelLastSurf`,
  `EP.epSD`, `xpSD` and the paraxial f-number are recorded, never gated; LV's paraxial kernel supplies the gated
  values.
- **The tab's MTF depends on its exact request.** The pupil seed alone moves the default MTF by 0.005–0.011, so
  "what LV presents" must be reproduced from the tab's own rules, not from LV's audit scripts.
- **LV changes several times a day** and optiland's version string carries a build date. Identity is content
  hashes, not commits or version strings.

## Architecture

```
case source ─► OpticalCase (IR, content-addressed) ─► orchestrator ─► EngineAdapter ─► Transport ─► engine
                                                          │            (in-process | stdio | one-shot | file-exchange | http)
                                                    result store ◄─ ResultEnvelope (ok | unsupported | error | pending)
                                                          │
                     estimators (comparator-owned math) ─► compare (pair + group, rung policy) ─► report (JSON + Markdown)
```

- **Two LV roles.** *Case source* (lens key + state → IR) and *engine* `lv` (in-process). Keeping them apart lets
  IR fixtures drive any engine and keeps LV knowledge out of the core.
- **RunSpec** — the user's "given set of specifications": lens (LV key or IR fixture); state (`zoomT`; `focusT` or
  a certified finite station); aperture (wide open | f-number by LV's rule | stop radius); lines (reference | cdf |
  photopic | explicit nm list); fields (image-height fractions resolved to LV's solved angles | degrees); image
  plane (design | LV best-axial | explicit shift); frequencies; sampling (LV grid cap, bundle grid, per-engine
  options); rungs; engines; reference engine. A **Suite** is a list of RunSpecs.
- **OpticalCase IR**, built only from `prepareRuntimeState(...).surfaces`, never from authored surface fields:
  vertex z, thickness, shape (`plane` | `conic` | `asphere` with generic `{power, coeff}` terms), effective clip
  radius (LV's inclusive limit), stop index and runtime stop radius, last-lens-surface index, object (`infinity` |
  `finite` from LV's certified conjugate), image z (design + focus shift), spectral lines with weights, and a
  per-line index table keyed by wavelength and index source, obtained through LV's own `mtfIndexResolver`. LV's
  frame is the contract frame, so injected rays need no transform. `system` and `conditions` hash separately;
  feature flags are derived from the IR. Ray sets carry a weight column every estimator uses unchanged.
- **Engine adapter**: `describe()` (identity, fingerprint, capabilities) and `run(request, case)`. Quantities are
  typed plug-ins: `system.describe`, `paraxial.first-order`, `rays.trace`, `mtf.native`, later more. Engines return
  primitives, plus their own product results under `*.native`. "Unsupported" is a first-class result shown in a
  support matrix.
- **One stateless protocol** (`hello` / `run` / `shutdown`; every `run` carries the case) over every transport.
  stdio is NDJSON; one-shot and file exchange are the same messages as files; a human-operated engine is a
  `pending` job collected later. A worker that speaks the protocol needs no TypeScript.
- **Numbers**: plain JSON numbers are finite scalars only. Arrays travel as little-endian float64 in base64 with
  sha256. Case and request identity hashes are computed only in TypeScript; workers hash their own sources and
  verify array digests.
- **Contract source of truth**: JSON Schema files in `contract/schema/v1/`, a stdlib-only subset validator in both
  languages, and a shared valid/invalid fixture corpus.
- **Comparison**: one `ComparisonSet` holds N participants as reference-vs-each or pairwise, so individual and
  group comparisons are the same structure. `policy/rungs.v1.json` maps each rung to tolerance and class.
- **Engines by the end of Phase 2**: `lv`, `ref`, `optiland`, plus fakes. Adding `optiland` must touch nothing
  under `src/core`, `src/contract`, `src/transports` or `src/compare`.
- **LV boundary**: `src/engines/lv/binding.ts` is the only file that imports LV, by dynamic import with local
  structural types, so `tsc` passes without LV on disk. A synchronous re-implementation of LV's resolve rule is
  registered with `module.registerHooks`; its load hook hashes every LV source it returns, giving the fingerprint.
  Drift guards: load-time export probe, canary fixtures with pinned numbers, source canaries on the LV rules the
  comparator mirrors, fingerprint before and after each run.
- **optiland worker**: run with `PYTHONPATH` and `-m`, never installed; needs only stdlib + numpy + optiland.
  One Optic per wavelength with `IdealMaterial`; `RadialAperture(r_max)` on every surface; `float_by_stop_size`;
  asphere `tol=1e-12`; non-deprecated API only; validity by `intensity > 0`. Native analyses use angle fields at
  LV's solved angle, `set_aiming('robust', max_iter=50, tol=1e-10)`, results mirrored in y to LV's frame, and
  `mtf[k][0]` = tangential (image y), `mtf[k][1]` = sagittal (image x). Never `ThroughFocusMTF`, `MTFvsField`,
  `image_solve` or the `.zmx` path. JIT on, with numba, bytecode and matplotlib caches under `.cache/`.
- **Toolchain**: Node ≥ 24.15 < 25, ESM, native type stripping (no build), `node:test`, zero runtime npm
  dependencies. The Python worker kit and fake engine are stdlib-only; tests are `unittest`.

Repo layout:

```
bin/lvrtc.mjs            contract/{CONTRACT.md, schema/v1/, fixtures/v1/}
src/{contract, core, transports, engines/{fake,ref,lv,optiland}, quantities, estimators, recipes, compare, report, cli}
workers/python/{lvrtc_worker_kit, lvrtc_optiland, tests/{kit,optiland}}
policy/rungs.v1.json     suites/     baselines/     reports/     docs/     test/
lvrtc.config.json        lvrtc.local.json (gitignored)   runs/ .cache/ (gitignored)
```

CLI: `doctor`, `lenses list|show`, `export`, `run <suite>`, `compare`, `report`, `mtf <lensKey>`,
`engine conformance <id>`, `baseline write|check`, `verify`, later `collect` and `serve`.

Glossary:

- **Line** — one wavelength with its weight. **Reference line** — the first line; its chief ray is the image
  reference point.
- **Identical rays** — LV's own launch rays (origin, direction) traced verbatim by every engine.
- **Binless** — a Fourier sum over ray landings, with no histogram.
- **`ref`** — a small comparator-owned tracer (sag, exact intersection, Snell, ABCD) used as arbiter and as the
  engine for tests that need neither LV nor optiland.
- **Rim band** — rays landing within 1e-8 mm of a clip radius, where engines may legitimately disagree.
- **Canary** — a pinned number or source excerpt whose change signals LV drift.
- **Census** — a dated snapshot over the whole catalog; informational, never asserted.
- **Recipe** — a multi-step procedure where one engine's result parameterises the next request (LV's focus shift
  and solved field angles feed every engine's MTF request).
- **Baseline** — a committed comparison record: metrics, worst location, counts, input hashes, fingerprints. No
  ray arrays and no prescriptions.

## Comparison ladder

Three modes: **direct** (closed-form numbers), **identical-rays** (one comparator estimator applied to every
engine's trace of the same rays), **independent-method** (each engine's own sampling and algorithm). Only the
first two are gated.

| Rung | Quantity | Mode | Gate |
|---|---|---|---|
| R0 | Built-system echo: vertex z, sag at 9 radii per surface, indices, apertures, stop | direct | sag ≤ 1e-12 scaled by its rounding size (see Amendments); rest bit-equal. Failure blocks later rungs |
| R1 | EFL, focal points, back focus from the last lens vertex, stop-derived entrance-pupil radius, pupil z | direct | 1e-9 mm; the position and the radius of a pupil also pass within 1e-12 of the pupil's distance from the image plane (see Amendments) |
| R2 | Per-surface hits, exit direction, image landing; clip mask | identical-rays | 1e-8 mm, 1e-9; 0 mismatches outside the rim band |
| R3 | Optical path to last surface and image; chief-relative OPD | identical-rays | 2e-5 waves |
| R4 | Binless geometric MTF, reference line and polychromatic, on rays valid in every engine | identical-rays | 1e-7, as planned; a field at every line is one comparison, and "every engine" is the two of a pair (see Amendments) |
| R4f | Fidelity: comparator estimator on a replay of LV's own sampling vs `computeMtf` geometric | direct | 1e-9, pinned at Stage 3.2; grid sizes, ray counts and field statuses equal (see Amendments) |
| R5 | LV product MTF vs engine-native MTF (first engine: `ScalarFFTMTF`) | independent | recorded; attention band 0.005 on axis / 0.01 off axis |
| R6 | Comparator wave OTF: on identical rays (a); vs LV's estimate (b); vs engine wavefront (c) | identical / independent | (a) gated at 4e-5, pinned at Stage 3.5 at 10× the measured maximum, on the fields whose lattice is an arbiter (see Amendments); (b) recorded, attention band 0.005 on axis / 0.01 off axis; (c) recorded |

Statuses: PASS; FLOOR; FAIL; RECORDED; ATTENTION (recorded, outside its band; not a failure); UNSUPPORTED; STALE;
ERROR. **FLOOR** applies to R2/R3 only when every other engine agrees with `ref` within 1e-10 mm / 1e-7 waves
*and* |`lv` − `ref`| ≤ 1e-7 mm per hit and 2e-4 waves; otherwise FAIL. Since Stage 2.0 the exit direction has a
floor too, 1e-12 and 1e-8 (see Amendments); which rays got through has none. Classes, decided in order:
unsupported, data (inputs not identical), convention (a missing declared transform; a comparator bug), numerical,
method.

## Phases and stages

Each stage is one commit. Every rung stage delivers its evaluator, policy entry and report section. Unit tests
are hermetic (synthetic fixtures, fake engines, `ref`). Integration tests need a configured LV path or optiland
interpreter and skip with a stated reason otherwise.

Suites: **benchmark** = the MTF plan's 11 lenses, 12 configurations (`nikon-z-24-70f4s` at both ends), all d-line
with even aspheres. **features** = one lens per translation path the benchmark lacks: odd asphere, e-line, mixed
d/e, A18/A20, flat-base asphere, authored rear-plate rim, fixed-iris zoom. (Since Stage 1.5 the suite has no run
for mixed d/e, nor for an annular aperture: no lens of the catalog has a case for either. See `docs/gotchas.md`.)
Since Stage 3.2 the benchmark suite states each configuration in the four conditions of the Phase 3 benchmark, as
runs of its own (see Amendments, "The benchmark in four conditions").

### Phase 0 — Foundations (no optics, no LV, no optiland)

Benchmark: `lvrtc run` → `compare` → `report` over three fake engines (TypeScript in-process, Python stdio, one
declaring the quantity unsupported) gives byte-identical Markdown twice, with reference-vs-each and pairwise
tables. CI green on a machine with only Node and Python.

| Stage | Deliver | Verify |
|---|---|---|
| 0.1 Bootstrap | `package.json`, `.nvmrc`, `tsconfig` (`nodenext`, `noEmit`, `allowImportingTsExtensions`, `erasableSyntaxOnly`, `verbatimModuleSyntax`), lint/format, `bin/lvrtc.mjs`, README, CLAUDE.md, CI | `npm run check` green on a clean clone |
| 0.2 Loader, config, doctor | Synchronous resolve + load hooks with source hashing; layered config (`lvPath`, `python`, `engines.optiland.python`); `lvrtc doctor` | Unit tests against a fake LV tree; doctor reports missing LV/optiland without failing |
| 0.3 Numeric core | Canonical JSON, sha256, float64 array codec, metrics, deterministic number formatting | Round-trip tests incl. −0, NaN payloads, infinities |
| 0.4 Contract v1 | Schemas: case, RunSpec, Suite, request, result, capabilities, provenance; subset validator; fixture corpus incl. a Double-Gauss IR; `CONTRACT.md` (frame, units, signs, S/T axes, worked RunSpec) | Validator accepts/rejects the corpus; schema-drift test |
| 0.5 Plug-in interfaces | Engine, transport and quantity interfaces; registry; capability negotiation; in-process transport; TypeScript fake engine | Negotiation unit tests; fake engine answers a request |
| 0.6 Orchestrator | Suite loader; content-keyed result store (resume = cache hit); `lvrtc run <suite> [--engines] [--rungs]` | Fake suite runs; a killed run resumes without recomputing |
| 0.7 Python worker kit | `lvrtc_worker_kit` (protocol loop, array codec, validator; stdlib only); stdio NDJSON transport; Python fake engine; `lvrtc engine conformance`; Python step in CI | Corpus passes under `unittest`; arrays echo bit-exactly |
| 0.8 Compare and report | `ComparisonSet`, `policy/rungs.v1.json`, pair + group comparison, `lvrtc compare`, `lvrtc report` | Golden-file tests; two runs byte-identical |

### Phase 1 — LensVisualizer as case source and engine

Benchmark: `lvrtc export --all` yields a valid case or a flagged feature list for every lens file with zero throws
(census committed as a dated snapshot). On the benchmark and feature suites, `lv` and `ref` agree on R0–R3 at the
reference line and the five photopic lines, and an LV numerical-floor report is committed.
`lvrtc mtf <key> --engines lv` writes the tab-default MTF table for the 12 configurations.

| Stage | Deliver | Verify |
|---|---|---|
| 1.1 LV binding | Import manifest, load-time probe, fingerprint (closure hash, lens-file hash, commit, dirty), catalog scan, `lvrtc lenses list/show` | Key count equals the number of `*.data.ts` files, all unique; `nikkor-z50f12` shows 35 surfaces incl. rear plate; probe fails cleanly on a fake tree missing an export |
| 1.2 Case exporter and suites | RunSpec → IR; stop-down rule mirrored from LV's hook with a source canary; `lvrtc export`; census; `suites/{smoke,benchmark,features}.json` | Unit: IR from a synthetic prepared state; integration: census; IR hash stable across runs |
| 1.3 `ref` first-order, R0/R1 | Sag/slope evaluator and ABCD paraxial on the IR; R0 and R1 evaluators | Analytic tests (singlet, doublet, conic, asphere) at roundoff level |
| 1.4 `lv` describe and paraxial | `system.describe`; `paraxial.first-order` from LV's paraxial kernel with the line's index table (pupil z from the kernel, not LV's stored constants, which are recorded) | R0 and R1 `lv` vs `ref` on both suites |
| 1.5 Ray sets and `lv` rays | Generators (probe grids past the rim; LV's MTF launch lattice at any grid, blocked cells and weights included); LV trace export; image-projection estimator | Pins copied from LV's golden-value test (three refractive lenses) reproduced within 5e-7 mm; own `traceEngineRay2` canaries on two benchmark lenses |
| 1.6 `ref` ray kernel, R2/R3 | Machine-precision sequential tracer; R2, R3 and clip-mask evaluators; FLOOR attribution; LV numerical-floor report | Analytic ray tests (hermetic); `lv` vs `ref` on both suites |
| 1.7 LV product MTF | `mtf.native` for `lv` with profile `lv-tab-default`: LV's own default preferences, fields at 10 % steps, 10 and 30 lp/mm, pupil seed and stop radius by the hook's rule, spectrum fallback recorded, f/8 by the tab's scaling | Source canaries on the tab and hook; focus shift and traced f-number equal LV's committed chart-regression report; a run with the audit-script seed must differ |
| 1.8 Zooms at both ends | A zoom is compared at both ends wherever no position is stated ([amendment](#zoom-lenses-at-both-ends)): the LV case source makes a suite run of a zoom without `state.zoomT` one run for each end; the census and `lvrtc mtf` follow; `smoke` and `features` run a zoom at both ends | Every zoom of the catalog exports at both ends or says why, with zero throws; R0 and R1 `lv` vs `ref` at the tele end of every zoom; R2 and R3 at the tele end of a constant-aperture, a variable-aperture and a fixed-iris zoom |

### Phase 2 — optiland adapter and ray-level parity (R0–R3)

Benchmark: `lvrtc run suites/benchmark.json --rungs r0,r1,r2,r3 --engines lv,ref,optiland` (and the feature
suite) passes every gated rung as PASS or FLOOR at six lines; `reports/benchmark/rays.md` committed; editing one
LV lens file flips that lens to STALE(case) and changing the optiland fingerprint flips its rows to STALE(engine).

| Stage | Deliver | Verify |
|---|---|---|
| 2.0 Gates before optiland | Three decisions of the owner after Phase 1, in force before a third engine is judged ([amendments](#amendments-since-approval)): a floor for the exit direction in R2; the radius of a pupil judged on the scale of the pupil's distance in R1; baselines keyed on the runs as run. Policy version 4; a report shows each plain figure beside the scaled one that is judged | Hermetic: each condition of the direction's floor failing on its own, and a direction with a position; a near pupil, a far one and one at infinity. With LensVisualizer: the nearly telecentric lens passes R1 entirely; benchmark and features keep their verdicts; the lenses that fail R2 for LensVisualizer's rounding swept before and after |
| 2.1 Worker skeleton | `lvrtc_optiland`: hello, capabilities, fingerprint (checkout sha + dirty, package source hash, Python/numpy/numba/scipy versions, JIT state); cache redirection; one timed FFT call | Conformance kit green; path + size + mtime snapshot of the optiland checkout identical before and after a JIT-enabled trace; no core module edited |
| 2.2 IR → Optic, R0 | Builder (even/odd asphere mapping, planes, apertures, stop, object, image plane); post-build echo re-read from the Optic; `docs/gotchas.md` started | `unittest` on fixtures; R0 on both suites; a deliberately shifted coefficient is caught and names the surface |
| 2.3 Paraxial, R1 | `paraxial.first-order` with reference conversions (image-relative → global; back focus from the last lens vertex) | R1 three-way `lv` / `ref` / `optiland` |
| 2.4 Rays, R2 | `rays.trace` via `RealRays` + `surfaces.trace`; intensity-mask validity; rim-band accounting | R2 three-way on both suites at every line, once with JIT on and once off |
| 2.5 Optical path, R3 | Path to last surface and image; comparator OPD re-referencing | R3 three-way on both suites |
| 2.6 Baselines and staleness | Baseline records, keyed on the runs as run: a zoom at each end ([amendment](#baselines-are-of-the-runs-as-run)); STALE(case) keyed on IR hash, STALE(engine) on fingerprint; `lvrtc baseline write/check` (OK / REFRESHABLE / DRIFT; non-zero exit only on DRIFT, FAIL or ERROR); hermetic `lvrtc verify` | CI validates baselines and regenerates reports byte-for-byte without LV or optiland; Double-Gauss optiland numbers replay against `ref` |

### Phase 3 — MTF v1 (R4, R5, R6a)

Benchmark: on the benchmark suite, wide open and f/8, at design focus and at LV's best-axial shift: R4 gated at
the reference line and photopic; R4f gated; R6a gated; R5 tabulated at fields 0 / 0.5 / 1 and 10 / 30 / 50 lp/mm
beside the comparator wave OTF, with each method's convergence flag. `lvrtc mtf <lensKey>` does it in one command
and `reports/benchmark/mtf.md` is committed.

| Stage | Deliver | Verify |
|---|---|---|
| 3.1 Geometric estimators | Binless geometric OTF and polychromatic complex sum (line weight × transmitted flux, one reference point) | Analytic OTF tests (hermetic) |
| 3.2 MTF recipe and product replay | Recipe core (LV's shift, angles and lines parameterise every request); replay of LV's refinement ladder and footprint widening from its exported helpers, with a source canary | R4f on all 60 benchmark fields, grid sizes and ray counts equal LV's; an unreplayable field is reported, never silently skipped |
| 3.3 R4 | Fixed-grid identical-ray bundles per field × line; R4 evaluator | R4 `lv` / `optiland` / `ref` at the reference line and photopic |
| 3.4 Wave-OTF estimator | Hopkins autocorrelation in direction-cosine space from optical paths; lattice size a free parameter; quarter-wave-per-cell validity reported per field | Analytic controls (hermetic): diffraction-limited, defocused and obscured pupils |
| 3.5 R6a and R6b | Estimator on LV rays vs optiland-traced identical rays (gate pinned here); LV's sheared estimate vs estimator (recorded) | Benchmark suite; grid-doubling convergence flag; unconverged fields are not used as arbiter |
| 3.6 optiland FFT MTF op | One field per call; ladder 128 and 256 rays with grid = 2 × rays, 512 only for ATTENTION rows; per-axis frequency interpolation; chief-landing check against LV before any row; reference-sphere strategy recorded; NaN axis and exceptions become status rows | `unittest` on optiland's Double-Gauss sample; failing-field isolation test |
| 3.7 MTF comparison and report | R5 table, difference classes, wording templates with a lint test and a fixed "Not covered" block | Golden report; lint rejects banned claims |
| 3.8 `lvrtc mtf` and baselines | Multi-engine `lvrtc mtf`; MTF baselines; `reports/benchmark/mtf.md` | Benchmark suite end to end; `baseline check` reports no DRIFT |

### Phase 4 — LV's default view, attribution and validation statement

Benchmark: per benchmark configuration, a three-way table (LV sheared estimate, comparator wave OTF, optiland FFT
and wavefront) with classes; the photopic best-axial MTF the tab shows has an external counterpart with stated
coverage; the Z 50/1.2 row carries a class and an evidence note; validation-statement inputs are committed.

| Stage | Deliver | Verify |
|---|---|---|
| 4.1 optiland wavefront op, R6c | `Wavefront.get_data` on an even grid inside the pupil edge → comparator OTF; three-way table | `unittest`; recorded rows with classes |
| 4.2 Z 50/1.2 investigation | Three-way numbers at the off-axis field; tangential frequency-step check on the vignetted pupil | Committed note with a stated class; an upstream issue draft in `docs/` for the user to file |
| 4.3 Polychromatic diffraction | Per line: complex OTF from 4.1, interpolated to common frequencies, phase-shifted by that line's chief landing relative to the reference line, weighted, summed before the modulus; image plane at LV's photopic best-axial shift | Synthetic two-line case with known lateral colour reproduces the analytic sum, and the un-re-referenced sum is shown to differ; benchmark rows recorded |
| 4.4 States | Stop-down and zoom-station matrix; the certified finite-conjugate stations | Gated rungs pass on each state |
| 4.5 Validation statement | `reports/benchmark/validation-statement.{json,md}`: per rung, tolerance, worst residual, configuration count, "Not covered" block; `docs/mtf-comparison.md` | Golden file; lint |

The supportable sentence: *identical rays, optical path and the geometric MTF computed from them agree with
optiland within 1e-8 mm, 2e-5 waves and 1e-7 on N configurations at six wavelengths, given identical indices and
apertures; optiland's FFT diffraction MTF differs by up to X; dispersion, white-light weighting, focus choice and
stop sizing are not covered.*

### Phase 5 — Catalog scale and regression

Benchmark: an unattended sweep of the gated rungs over every MTF-candidate lens (~850) completes with zero ERROR
rows; `reports/catalog.md` gives status counts by feature, quantiles, worst-10 lists and the unsupported census;
every FAIL has a class and a reproducer command.

| Stage | Deliver | Verify |
|---|---|---|
| 5.1 Throughput | Worker pool and parallel suites | Results identical to a serial run |
| 5.2 Long-tail features | Translator gaps surfaced by the census | Each passes R0–R3 or is declared unsupported with a reason |
| 5.3 Catalog sweep | Sweep suite and statistics report: every prime, and every zoom at both ends | Sweep completes; report deterministic |
| 5.4 Real-engine check | `npm run verify:real` (benchmark suite against live LV and optiland) | Runs clean on the development machine |

### Phase 6 — Beyond MTF

Benchmark: `reports/benchmark/validation-matrix.md` has a row for every LV analysis tab below.

| Stage | LV tab / quantity | optiland counterpart | Gated on identical rays | Recorded |
|---|---|---|---|---|
| 6.1 | `lv-legacy` engine (LV's second tracer, behind coma, field curvature, bokeh, lateral colour) | — | R2 `lv-legacy` vs `lv` vs `optiland`, 1e-8 mm | — |
| 6.2 | Coma, bokeh: spots and ray fans | `SpotDiagram`, `RayFan` | Centroid, RMS radius, transverse error, 1e-8 mm | Native spot and fan values |
| 6.3 | Spherical aberration; longitudinal colour | per-wavelength Optics | Axial intercepts from LV's marginal rays | Paraxial chromatic focal shift (a different quantity) |
| 6.4 | Distortion; lateral colour; pupils; breathing | `Distortion`, `PupilAberration`, `paraxial.*` | Landings of injected LV chief rays, 1e-8 mm; breathing under R1 | Each engine's percent distortion, reference convention stated |
| 6.5 | Field curvature, astigmatism | `FieldCurvature` | T/S focus from injected parabasal pairs | Native curves |
| 6.6 | Vignetting, relative illumination | none | Comparator 2D transmitted-flux ratio | LV's 1D sweep × cos⁴ (method difference) |
| 6.7 | Summary and cardinal elements | `paraxial.*` | Covered by R1 per focus and zoom state | LV's nominal pupil and f-number |
| 6.8 | No LV tab: wavefront, Zernike, Seidel | `Wavefront`, `ZernikeOPD`, `aberrations.seidels()` | — | Native values; `ref` vs engine where defined |

Verify, each stage: its identical-ray rung gated on the benchmark suite plus a golden report section. LV's
non-MTF tabs trace infinity-object rays even at close focus, so these run at infinity focus.

### Phase 7 — More engines and transports

Benchmark: a further engine is added by config plus an adapter or worker with no core module edited; the
conformance kit passes on it; a group report shows the pairwise matrix and consensus.

| Stage | Deliver | Verify |
|---|---|---|
| 7.1 One-shot transport | Request file in, result file out | Conformance kit passes over it with the Python fake engine |
| 7.2 File exchange | Outbox, pending, inbox, `lvrtc collect`; prescription writers with full coefficient sets for human-operated engines | A pending job survives a restart and is collected, using a fake human-operated engine |
| 7.3 Second external engine | Chosen then (e.g. rayoptics through the worker kit, or OpticStudio by file exchange) | Conformance kit; R0–R3 on the benchmark suite; `docs/adding-an-engine.md` followed as written |
| 7.4 Group reports | Pairwise matrix, consensus, outlier engine | Golden group report from three fakes including an outlier |
| 7.5 HTTP transport | Built when a consumer exists | Conformance kit over HTTP |

### Phase 8 — Dashboard

Benchmark: `lvrtc serve` shows the support matrix, MTF overlays per engine, residual views and STALE badges from
the existing result store and baselines.

| Stage | Deliver | Verify |
|---|---|---|
| 8.1 Read-only server | View models over runs and baselines | Every view-model number equals the result JSON |
| 8.2 Charts | MTF overlays, difference curves, ladder heat map, per-surface ray deviation | Snapshot tests on fixture runs |
| 8.3 Run control | Start a suite and collect pending jobs from the UI | Starts the fake suite end to end |

## How stages are run, and economy mode

Each stage is implemented by one agent, reviewed by a second, then verified and committed by the main session.
Since Stage 2.6 the stages run in **economy mode**, which the owner approved on 2026-10-08 because the weekly
token allowance was nearly used. It stays in force until the owner lifts it.

| | Standard (through Stage 2.5) | Economy (Stage 2.6 onward) |
|---|---|---|
| Implementer effort | extra-high for numerics, high for plumbing | unchanged |
| Reviewer effort | extra-high | high |
| Catalog-wide sweeps, large fault-injection runs, fuzzing | run in review as a matter of course | only when a gated rung fails or a specific doubt needs it |
| Extended-precision attribution (50 to 60 digits) | run on figures near a gate | only when a gated rung fails |
| Reports from agents | full | short: what changed, what was measured, what is left |

What economy mode does not change: every stage still has its tests, the three test tiers must be green before a
commit, no gate is loosened, and a rung that fails is still attributed before anything else is concluded. What it
costs: review is less likely to find a defect that no test and no gate shows.

Work stops at the end of each phase for the owner's go-ahead while economy mode is in force.

## Relation to MTF_ACCURACY_PLAN.md

| MTF-plan item | Disposition |
|---|---|
| Rungs: paraxial 1e-9, rays 1e-8 mm, path 2e-5 waves, geometric MTF 1e-7 | Kept (R1–R4) |
| FFT MTF differences recorded, not asserted | Kept (R5); the attention band is the plan's withdrawn 0.005 / 0.01 tolerance |
| Benchmark set | Kept; a feature suite is added |
| STALE on an input-hash mismatch | Kept, split into STALE(case) and STALE(engine) |
| Tool is an optional diagnostic, not a gate for LV | Kept |
| "Inject our rays and run `ScalarFFTMTF`" | Amended: impossible; identical-ray rungs use comparator estimators |
| "512 rays, 1024 grid" | Amended: 128/256 ladder, 512 only for ATTENTION rows (cost) |
| Wording: "rays and monochromatic diffraction MTF agree with optiland" | Amended to the supportable sentence under Phase 4 |
| Export script and Python script inside LV | Moved to this repo |
| `reports/data/mtfOptilandReference.json` in LV | Moved to `baselines/` here |
| Gotchas entries for optiland defaults | Moved to `docs/gotchas.md` here |
| Double-Gauss case in LV's `npm test` | Amended: an IR fixture replayed hermetically here |
| R0, R4f, R6, FLOOR, the direction gate | Comparator additions; the R4f tolerance was pinned at Stage 3.2, the R6a tolerance is provisional until measured |

## Amendments since approval

Gates changed after the plan was approved, each on a measured numerical floor and never to make one lens pass.

| Rung | Change | Evidence |
|---|---|---|
| R0 | The sag gate is `sag.maxScaled` ≤ 1e-12, the difference divided by how large a rounding error of that sag can be (defined in `contract/CONTRACT.md`). The plain difference is still reported. | Two exact evaluators that sum the same terms in a different order differ by up to 1.34e-10 mm on five catalog lenses whose polynomial terms cancel heavily; scaled, the worst lens in the catalog is 5.5e-16. |
| R1 | A pupil position passes within 1e-9 mm, or within 1e-12 of its distance from the image plane when that is larger. Every other R1 quantity keeps 1e-9 mm. | One near-telecentric catalog lens has its exit pupil 7.7 to 20 m away; in exact rational arithmetic both `lv` and `ref` are off by 1e-9 to 5e-9 mm there, a relative error of about 1e-13. The next largest pupil difference in the catalog is 1.9e-11 mm. |
| R1 (Stage 2.0, policy version 4) | The radius of a pupil is judged as its position is: `entrancePupilSemiDiameter` and `exitPupilSemiDiameter` pass within 1e-9 mm, or within 1e-12 of that pupil's distance from the image plane when that is larger (`pupilRadius.maxScaled`, the same scale as `pupilZ.maxScaled`; the plain `pupilRadius.maxAbs` is reported beside it). The six values that are no pupil's keep the plain 1e-9 mm, and so does the radius of a pupil within a metre of the image plane. A pupil at the same infinity in both engines is equal, in position and in radius. | The radius of a far pupil is the stop's radius times the quotient that places the pupil, and is known as well as the pupil is placed and no better. On the same lens the exit pupil is 6.3 m in radius at 650 nm, 14 m from the image plane, and `lv` and `ref` hold 1.35e-9 mm apart, 2e-13 of it: the one pair of the 1676 cases of the catalog that still failed R1. On the scale of the distance it is 9.4e-11. Neither engine is wrong there: in exact rational arithmetic on the vertices, radii and indices of the case, `lv` is 5.2e-10 mm above that radius and `ref` 8.3e-10 mm below it, 1e-13 of it each; and with the gaps taken as exact in place of the vertices they are the sums of, which is one rounding apart, the exact radius itself moves by 6e-10 mm there and by 1.2e-9 mm at 610 nm, where the pupil is 19.5 m away. No arithmetic in doubles holds that radius to 1e-9 mm. Every other pupil radius of the catalog is within 4.2e-12 mm, and every value that is no pupil's within 1.1e-11 mm (LensVisualizer `1ed8cc3d`, closure `ff670f03`); at the tele end of every zoom (576 cases) all of R1 passes before and after, with no pupil radius more than 5.1e-11 mm apart. |
| R2 (Stage 2.0, policy version 4) | The exit direction has a floor, on the pattern of the lengths: a pair of `lv` whose `direction.maxAbs` is above 1e-9 may be `FLOOR` when every other engine agrees with the arbiter `ref` within 1e-12 in direction and `lv` is within 1e-8 of `ref`, ten times the gate; beyond that it is `FAIL`. Every metric with floor limits is held to them together, so a direction within its limit never excuses a hit beyond its own. Which rays got through keeps having no floor. | A direction is carried by the same hit as a position: LensVisualizer's 1e-9 mm at one surface, magnified by a steep one behind it. Over the catalog (14 370 ray sets, 9.5 million rays both engines land; LensVisualizer `1ed8cc3d`, closure `ff670f03`) 19 pairs of R2 failed for that rounding, each with a direction of 1.0e-9 to 4.1e-9 as a figure without a floor. Whose rounding it is was settled ray by ray: a trace in 50-digit arithmetic that shares no code with either engine, made at closure `ff670f03` on every ray both engines land of the 14 pairs that are floors now and of the three of the same zoom that are not (17 ray sets, 11 387 rays), puts `ref` within 3.8e-14 mm and 1.5e-14 in direction of the truth on the two phone lenses, within 1.7e-11 mm and 4.9e-13 on the zoom, and the whole excess on `lv` (`docs/gotchas.md`). With the limit, 14 are `FLOOR`: five in which the direction is the only figure above a gate, six in which it goes with a hit 1.1e-8 to 1.2e-8 mm off, and three of one wide zoom whose hits are 2.5e-8 to 7.3e-8 mm off. The 5 that stay `FAIL` are a hit or a landing beyond 1e-7 mm, on three lenses. No other verdict of the sweep moves: R2 from 14 235 `PASS`, 39 `FLOOR`, 96 `FAIL` to 14 235, 53, 82 (77 of them rays LensVisualizer loses at crossing surfaces); R3 unchanged at 14 345, 24, 1. The largest direction of any floor is 4.07e-9, and no direction of the catalog is beyond 1e-8 on rays both engines pass. At the tele end of every zoom (5056 ray sets) no verdict moves either: no direction there is above 1e-9. The agreement of 1e-12 is the tightest of the floor's figures, a thousandth of its gate, and is not yet measured on a third engine: on that zoom `ref` itself is up to 4.9e-13 from the truth in direction, so an engine as exact as `ref` may be more than 1e-12 from it there, and the zoom's floors would then be `FAIL` (it is in no suite). On the Hologon, the lens of the suites' floors, `ref` is within 6.5e-16. Stage 2.4 measured it with optiland (LensVisualizer `14da71d9`, closure `78215d72`), and changed no limit: on the 378 ray sets of the two suites optiland is within 2.1e-14 of `ref` in direction, 1.2e-12 mm in a hit and 8.9e-13 mm in landing, so every floor of a suite has its witness; on that zoom at its wide end it is 3.2e-11 and 8.6e-10 mm from `ref`, by the 60-digit trace through its own uncompensated sums on an asphere, and of 50 pairs of `lv` that are `FLOOR` beside `ref` alone on nineteen lenses outside the suites, 14 are `FAIL` beside optiland for want of a witness (`docs/gotchas.md`). |
| R4f (Stage 3.2, policy version 6) | The rung is in the policy, gated, of the two engines `lv` and `replay`. Its provisional gate of 1e-9 on the MTF is kept as measured, and no longer provisional. Two gates are added beside it, each at 0: `sampling.mismatches`, the grid a field's refinement ends at and its counts of rays that landed, were stopped and were not resolved, and `fields.mismatches`, a field's status and reason. They are what the stage's verification asks ("grid sizes and ray counts equal LV's"), stated as metrics so that a baseline can record them. No floor. | On the benchmark suite in its four conditions (96 runs, 480 fields, 51 frequencies, both cuts; LensVisualizer `33ebdb30`, closure `78215d72`) the largest difference between LensVisualizer's own `computeMtf` and the comparator's estimator on the replayed rays is 1.25e-14: `nikkor-z50f12` at its best focus on the reference line, half field, sagittal, 6 cycles/mm. On the photopic lines no run is above 6.2e-15; the feature and smoke suites (23 runs) are within the same 1.25e-14. Not one grid size, ray count or status differs in any run. The difference is rounding and no method: both sides add up the same terms, the landings and weights of the same rays about the same reference point, LensVisualizer plainly and with a phasor rotated from frequency to frequency, the estimator with every phase reduced on its own and compensated sums. The gate is 80 000 times the measured maximum, so it measures nothing of LensVisualizer's arithmetic; it is kept at the plan's figure and not tightened, because a later LensVisualizer may add its terms up in another order, and a gate that fails on an order of summation would say nothing of the sampling, which is what the rung is of and what the two counts hold exactly. |
| R4 (Stage 3.3, policy version 7) | The rung is in the policy, gated at the plan's 1e-7 on `mtf.maxAbs`, with no floor: no limit moved. What the stage decided is what the figure is of. (1) The bundles are the run's ray sets, LensVisualizer's launch lattice at `sampling.bundleGrid` cells (32) per field and line, the rays R2 and R3 judge; not the grid a field's refinement ends at, which R4f holds. (2) A field's sets at every line are one comparison (a set that spans requests, `contract/CONTRACT.md`), so the photopic figure is the modulus of the sum over the lines. (3) "Valid in every engine" is of the two engines of a pair: a ray is in both sums or in neither, and a pair's figures depend on its own two answers. (4) The landing is each engine's own `imagePoint` on the plane of the run's case, which since Stage 3.2 is the recipe's plane; nothing is projected a second time. (5) The reference point is midway between the two engines' flux-weighted centroids of the first line's rays. The dropped rays are counted (`rays.dropped`) and judged by R2 alone. R4 is in the committed baselines beside R0 to R3. | On the benchmark in its four conditions (96 runs, 288 fields, 611 140 rays a pair, 51 frequencies from 0 to 100 cycles/mm, both cuts; LensVisualizer `33ebdb30`, closure `78215d72`; optiland `4e893f53`) every pair is `PASS` and no ray is dropped. `lv` against `ref`: 5.39e-8 at worst (`sigma-45mm-f28-dg-dn-contemporary` at f/8 and best focus, reference line, full field, tangential, 98 cycles/mm); 8.0e-9, 1.8e-8 and 4.0e-8 at 10, 30 and 50 cycles/mm; 2.9e-8 on the photopic lines. `lv` against optiland: the same. optiland against `ref`: 1.20e-11. The feature suite (18 runs, 54 fields): 4.8e-8, 4.8e-8 and 6.7e-12, all `PASS`. LensVisualizer stands at 54 % of the gate; the two exact tracers at a ten-thousandth of it. A landing within R2's 1e-8 mm may turn a term by sixty times this gate at 100 cycles/mm, so R4 is the tighter of the two (`docs/gotchas.md`); whether it is to have a floor is left to the owner. The 1152 and 216 baseline records of R0 to R3 are what they were; 288 and 54 are new. |
| R6a (Stage 3.5, policy version 8) | The rung is in the policy, gated on `waveMtf.maxAbs` ≤ **4e-5**, with no floor: its gate is pinned here, as planned, at ten times the measured maximum, rounded up to one digit. What the figure is of: (1) the comparator's wave estimator on each engine's `rays.trace` answer, on the rays both engines of a pair land, at every line of the case as one comparison, about the point midway between the two engines' flux-weighted centroids, as R4. (2) Two lattices a field: the run's own ray sets (32 cells across the beam, the rays R2 to R4 judge, untouched) and the same field at 64, generated by the same source and asked of this rung alone; the finer is judged. (3) A field is judged only where its lattice is an arbiter: neighbouring cells within a quarter wave in both estimates, and neither estimate moved by more than 0.005 on the axis, 0.01 off it, from the coarser lattice (the plan's band for an MTF held to another method's). Any other field is reported with its figure (`waveMtf.flagged`) and the fact that flagged it, is judged by nothing, and is in no pin. (4) The frequencies are the recipe's thinned to eleven, 0 to 100 cycles/mm in steps of 10. R6a is in no committed baseline: the finer lattice is 15 GB of traces and 8 minutes on the benchmark, so the MTF baselines (Stage 3.8) decide. | On the benchmark in its four conditions (96 runs, 288 fields, both cuts; LensVisualizer `33ebdb30`, closure `78215d72`; optiland `4e893f53`) every pair is `PASS` and no ray is dropped. 208 fields are judged, 80 flagged (25 undersampled, 17 not converged, 38 both). Over the judged fields: `lv` against `ref` 3.12e-6 at worst (`sony-fe-20mm-f18-g` at f/8, design plane, reference line, full field, tangential, 30 cycles/mm); `lv` against optiland 3.11e-6 (the same field); optiland against `ref` 1.15e-9 (`nikon-z-24-70f4s` wide, best focus, reference line, full field, tangential, 50 cycles/mm). By condition `lv` against `ref` is 2.7e-6 wide open, 2.8e-6 at best focus, 3.1e-6 at f/8 and at f/8 and best focus; on the photopic lines 2.2e-6. Ten times 3.12e-6 is 3.12e-5: 4e-5. **The pin is of LensVisualizer's rounding** (its 1e-9 mm at a surface, carried into the optical path) **and not of the two exact tracers**, which agree 2700 times closer; a gate of the exact tracers alone would be 2e-8. The flagged fields are of the same size (`lv` up to 1.84e-6, optiland against `ref` 6.6e-10) and would not have moved it. **Not covered**: wide open 66 of 144 fields are judged (31 at the design plane, 35 at best focus), and of `nikkor-z50f12` and `sony-fe-20mm-f18-g` none at the design plane: their wavefronts turn by 0.5 to 1 wave a cell at 64 cells and would need 128 to 256, sixteen to sixty-four times the rays of the run's own lattice; nothing was widened to cover them. At f/8, 142 of 144. Whether R6a is to have a floor is left to the owner. |
| R6b (Stage 3.5, policy version 8) | The rung is in the policy, **recorded**, of the two engines `lv` and `wave`: LensVisualizer's own diffraction MTF beside the comparator's wave estimator on the rays LensVisualizer launches and traces, the lattices R6a judges. It has the plan's attention band, 0.005 for the field on the axis (`mtfOnAxis.maxAbs`) and 0.01 off it (`mtfOffAxis.maxAbs`), over the fields both answers stand by; a field an answer calls unconverged is written down in no band (`mtfFlagged.maxAbs`). Nothing of it is gated, and it is in no committed baseline. | On the same benchmark (three fields a run, eleven frequencies): 91 pairs `RECORDED`, 5 `ATTENTION`, none an error; 208 fields in a band, 80 flagged, every one by the estimator. At f/8 no pair is marked: at most 4.99e-3 on the axis and 7.75e-3 off it. The five marked are on the axis, wide open at the design plane, 5.5e-3 to 7.5e-3 (`nikon-z-24-70f4s` tele on both sets of lines, `nikon-z-135f18-plena`, `nikon-z-mc-105f28`, `canon-ef-135-f2l-usm`). The class of the differences is method, and within it the lattice: LensVisualizer ends its refinement at 32 cells for 119 of 144 fields at f/8, where the estimator is at 64. On one grid the two methods differ by 5e-4 on average (4.5e-4 at 32 cells, 5.7e-4 at 64); with 32 against 64 by 2.9e-3, which is what the estimator itself moves by on doubling (`docs/REFERENCE.md`). |
| R2, R3 (Stage 2.6, policy version 5) | The floor of `lv` no longer needs every other engine within `agreement` of `ref`. A witness beyond it is named in the reason and withholds nothing; only a witness nearer to `lv` than to `ref` fails the pair, as arbiter-suspect. No limit moved ([below](#a-witness-does-not-withhold-a-floor)). | On four catalog lenses outside the suites optiland is about 9e-10 mm from the exact hit where `ref` is 6e-12 mm and `lv` 2e-8 mm: beyond the 1e-10 mm of agreement, and about 25 times nearer to `ref` than to `lv`. 14 of 50 floors in R2 and 9 of 11 in R3 were `FAIL` beside it. The suites keep their verdicts. |

### optiland's MTF is of one line

A decision of Stage 3.6, on the question the stage was handed: how a polychromatic MTF is formed of optiland's
per-line results. It is not.

| What | Decision | Why |
|---|---|---|
| A case of several lines | `mtf.native` of `optiland` answers one line: the case's only line, or the one the engine option `line` names. Without it the request is `unsupported` (`lines.polychromatic`). | optiland's `ScalarFFTMTF` is of one wavelength and gives a modulus, each line's PSF centred on its own chief ray. A polychromatic MTF is the modulus of a sum of complex transfer functions about one image point: of moduli none is formed, and a mean of moduli is an upper bound that is no MTF. |
| R5 in Phase 3 | The reference-line runs of the benchmark carry it. A photopic run has no optiland row until Stage 4.3, which forms the sum from optiland's wavefront with the comparator's estimator, as planned. | Nothing is substituted for what an engine cannot compute. |
| The pupil | The plan's `set_aiming('robust', max_iter=50, tol=1e-10)`: optiland's grid lies on the stop surface, out to its clip radius. | Without aiming the grid is the paraxial entrance pupil, which the beam of a fast lens does not fill. |
| The 512 step | The engine option `fftRays: 512`, which the result store keys by; no change to the quantity, which stays at version 1. | The comparator asks it only for an ATTENTION row (Stage 3.7). |

### Zoom lenses at both ends

Not a gate, a rule of what is compared, added at the owner's request in Stage 1.8.

| Rule | Where it applies | What it does not cover |
|---|---|---|
| Zoom lenses are compared at both ends, zoom 0 (wide) and zoom 1 (tele), wherever no position is stated. A prime is unaffected; an explicit position (`state.zoomT`, `--zoom`) still selects exactly one state. Whether a lens is a zoom is LensVisualizer's own answer. | Suite runs of LensVisualizer lenses (`<name>-wide`, `<name>-tele`), the census (`lvrtc export --all`), `lvrtc mtf <lensKey>`, and every later sweep and baseline built on suites. | Middle stations are Stage 4.4. `lvrtc export <lensKey>` and `lvrtc lenses show` stay single-state tools. |

Measured at LensVisualizer `ed78cf40` (closure `1827eefe`): 297 zooms, 296 of which export at each end (one has a
diffractive surface at both); at the tele end all 296 pass R0 and R1 against `ref` on the reference line and all
280 that have photopic lines pass there too (worst `sag.maxScaled` 4.3e-16, `firstOrder.maxAbs` 9.4e-11 mm,
`pupilZ.maxScaled` 6.7e-11). Traced at the tele end in one sweep outside the tests (5056 ray sets, 3.4 million
rays ok in both), every pair passes R3; in R2, 5006 pass, 6 are `FLOOR` (one lens) and 44 fail on the mask: three
zooms whose stop lies behind the surface before it at that end, two of them at that end only (`docs/gotchas.md`,
"Where two neighbouring surfaces cross, the ray is lost").

### The benchmark in four conditions

A decision of Stage 3.2, on the question the stage was handed: where f/8 and the two focus planes of the Phase 3
benchmark live.

| What | Where it lives | Why |
|---|---|---|
| The f/8 comparison | A run's `aperture`, `{ "kind": "lv-f8-comparison" }`: the stop of the f/8 comparison of LensVisualizer's MTF tab, by the tab's own scaling. A lens the tab offers none for is a run without a case, with the tab's reason. | Another stop is another system. The tab's scaling is not the aperture slider's f/8 to the bit on every lens, and the benchmark is of what the tab shows. |
| LensVisualizer's best axial focus | A run's `imagePlane`, `{ "kind": "lv-best-axial" }`, which the run schema had from the start: the case is exported at the plane LensVisualizer's own focus search finds for the stop and the lines of the run. | Every engine is then asked about one case, at one plane, and no evaluator carries a focus shift. The plane is of a stop and of lines, so each run has its own. |
| The benchmark | `suites/benchmark.json`: the 24 runs of Phases 1 and 2 first, unchanged and in their order, then 72 runs, `<configuration>-best-…`, `-f8-…` and `-f8-best-…`, on both sets of lines. | Baselines are keyed on runs as run: each condition has a record. The existing R0 to R3 records keep their names, their cases and their figures. |

Every lens of the benchmark is offered f/8 by the tab (each is faster than f/7.95 wide open and stops down to f/8
or beyond). The committed baseline of the benchmark holds R0 to R3 of all 96 runs on `lv`, `ref` and optiland,
and since Stage 3.3 R4 beside them. R4f is in no committed baseline yet, nor are R6a and R6b (Stage 3.5): the MTF
baselines are Stage 3.8. A baseline can hold R4f (`lvrtc baseline
check` runs the rungs that compare the engines of a run on those engines, and leaves a rung of its own engines to
ask them), and until then R4f is held by `npm run test:lv` on all 96 runs, R6a by `npm run test:optiland` on 17
of them and R6b by `npm run test:lv` on six.

### Baselines are of the runs as run

A decision of the owner after Phase 1, recorded in Stage 2.0 for Stage 2.6: a baseline is keyed on the runs after
zooms expand to both ends, never on the suite file as written. A zoom that a suite names once has two baseline
records, `<name>-wide` and `<name>-tele`, each with the content hash of its own case; a lens that becomes a zoom,
or stops being one, changes the records and not only their figures.

| What a baseline is keyed on | Where it is today | What it is not keyed on |
|---|---|---|
| The run as run: its name after expansion and the content hash of its case; then the rung, the request and the two engines with their fingerprints. | The run manifest: `runs[]` is the expanded list, in order, each with `name`, `caseId` and the identities of its ray sets, and every job states its `run`, `caseId`, `rung`, `requestId` and `engine`. Nothing was added to the manifest for it. | `suite.hash`, which is the hash of the suite as written and is the same whether or not a lens of it is a zoom. It stays what says which file was run. |

### A witness does not withhold a floor

A decision of the owner after Stage 2.5 ("Let's roll with your recommendations"), in force from Stage 2.6 and
policy version 5. The limits of the floor are where they were; what changed is what a third engine may do to it.

| Before (policy version 4) | Since (policy version 5) |
|---|---|
| A pair of `lv` above a gate was `FLOOR` only when `lv` was within the floor's `limit` of `ref` **and** every other engine was within `agreement` of `ref`. | It is `FLOOR` when `lv` is within `limit` of the arbiter `ref`. Every other engine is a witness: within `agreement` of `ref` it corroborates; beyond it the pair is still `FLOOR`, and its reason says that the witness did not corroborate, with the witness's own distance from `ref`. |
| A third engine's own rounding, where it exceeded `agreement`, was `FAIL` for `lv`. | The one case that blocks a floor is a witness beyond `agreement` that is nearer to `lv` than to `ref` in that metric: `FAIL`, with the reason "arbiter-suspect". In the pair of `lv` with a witness, an excess where the witness is as far from `ref` as `lv` is, or farther, is the witness's own and stays `FAIL`. |

The evidence, measured in Stages 2.4 and 2.5 and attributed in 60-digit arithmetic: on four lenses of the catalog
outside the suites (`fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr` at its wide end, `fujifilm-fujinon-xf-27mm-f28`,
`apple-iphone-7-wide-camera-lens`, `russar-22-70f8`) optiland is about 9e-10 mm from the exact hit where `ref` is
6e-12 mm and LensVisualizer 2e-8 mm from it. optiland exceeded the 1e-10 mm of agreement while siding with `ref`
by a factor of about 25, and 14 of 50 floors of `lv` against `ref` in R2 and 9 of 11 in R3 were `FAIL` beside it.
A witness's own error says nothing about whose the excess is. No limit of the policy moved, no gate was loosened,
and the verdicts of the suites are what they were: the benchmark all `PASS`, the feature suite and the focus
stations `PASS` with the Hologon's rows and one station `FLOOR`. Also recorded and not implemented: the optiland
worker does not shield a batch from its ended rays; optiland is reported as it behaves.

### Baselines as committed, and the contract version

Stage 2.6 commits `baselines/benchmark.json` and `baselines/features.json` (`lv`, `ref`, optiland on R0 to R3),
each with `reports/<suite>/rays.md` and `rays.json` rendered from it. `reports/benchmark/lv-floor.{json,md}`, the
digest of Phase 1, is folded into them and no longer committed. The contract stays at `1.0`: the first baselines
are written to `1.0` as it stands with them, so no committed document needs a `1.1` to tell it from an earlier
one; the next addition raises the minor. `lvrtc verify` fails a baseline that was judged by another policy than
the one at hand, so a change to the policy is committed together with rewritten baselines.

## LensVisualizer changes

None is required. Optional, each a user decision on evidence the comparator produces:

- Caller-tunable or tighter surface-intersection tolerance (would turn FLOOR rows into PASS).
- Closed-form paraxial pupil positions; an engine helper for the stopped-down stop radius.
- One documented barrel re-exporting the deep imports the comparator uses.
- Docs only: amend the MTF plan's wording sentence, point its cross-check section here, and decide whether the
  article links the comparator report or LV keeps a copied JSON.

## Open decisions (defaults assumed unless changed)

- **LV reference revision**: the working tree at run time, identified by closure hash, commit recorded.
- **What is committed**: baselines and reports hold result numbers, hashes and lens keys only; no LV-derived
  prescription is committed, only synthetic fixtures. (This repo has a GitHub remote.)
- **optiland JIT**: on, cache under `.cache/`. Stage 2.1 timed it (`docs/REFERENCE.md`, "The engine `optiland`"):
  a trace of 4096 rays takes 0.8 ms with it and 20 ms without, after 0.9 s of compiling once per cache.
- **Second engine** (Stage 7.3): chosen when Phase 7 starts.

## Existing code reused

LV (`LensVisualizer/LensVisualizer/src/`, imported by path, read-only):

- `optics/buildLens.ts` (default export), `optics/compat.ts` — `prepareRuntimeState`, `traceEngineRay2`,
  `traceRay2`, `computeCardinalElements2`, `entrancePupilAtState2`, `computeAnalysisFieldGeometryAtState2`,
  `createAnalysisComputationContext`
- `optics/apertureStop.ts` `wideOpenStopAtZoom`; `optics/aperture.ts` `fNumberAtStopdown`;
  `optics/trace/aperture.ts` `evaluateAperture`
- `optics/math/paraxial.ts` `traceParaxialSurfaces2`; `optics/first-order/cardinals.ts`
  `buildCardinalElementsFromMatrix2`; `optics/first-order/systemMatrix.ts`
- `optics/mtf.ts` `computeMtf`, `assessMtfSupport`, `resolveMtfSpectrum`
- `optics/analysis/mtfTracing.ts` `prepareMtfFieldLaunch`, `findMtfFieldFootprint`, `mtfLaunchGrid`,
  `mtfLaunchRay`, `traceMtfBundle`, `mtfImagePoint`, `mtfIndexResolver`, `mtfTraceOptions`
- `optics/analysis/mtf.ts` `refineMtfField`; `optics/analysis/mtfFootprint.ts` `expandMtfFootprint`;
  `optics/analysis/mtfMath.ts` `geometricOtf`, `combineOtfs`; `optics/analysis/mtfConstants.ts`
- `utils/state/mtfPreferences.ts` (tab defaults); source canaries on `components/display/analysis/MtfTab.tsx`,
  `components/hooks/useLensComputation.ts`, `components/hooks/mtf.worker.ts` and `optics/analysis/mtf.ts`

optiland (called, never modified): `Optic.surfaces.add`, `IdealMaterial`, `RadialAperture`, `set_aperture`,
`ray_tracer.set_aiming`, `RealRays` + `surfaces.trace`, `paraxial.*`, `ScalarFFTMTF`, `Wavefront.get_data`.

## Risks

- **LV deep imports are unversioned and LV changes daily.** One binding file, load-time probe, canaries, content
  fingerprints; an unchanged IR hash keeps external baselines valid across LV commits.
- **optiland FFT cost and fragility** (6–21 s per field at 256 rays without JIT; ~240 field calls per ladder
  level). One field per call, result store, three fields per configuration, 512 rays only on demand.
- **Reading a recorded difference as an error.** Fixed statuses, classes and report wording; lint test.
- **Rim-band rays** flip one engine's mask and move MTF by ~2e-3. A mask mismatch fails R2, never R4.
- **optiland upgrades** (deprecated wrappers removed in v0.7.0). Non-deprecated API only; fingerprint → STALE.

## Verification

- Every stage: `npm run check` (typecheck, lint, format, `node --test`) and, where Python changed,
  `python3 -m unittest discover workers/python/tests/kit`; optiland-side tests run with the configured interpreter.
- Phase 0: `node bin/lvrtc.mjs run test/fixtures/suites/fake-3-engines.json`, then `compare` and `report`, twice;
  diff the outputs.
- Phase 1: `lvrtc doctor`; `lvrtc lenses show nikkor-z50f12`; `lvrtc export --all`;
  `lvrtc run suites/benchmark.json --engines lv,ref --rungs r0,r1,r2,r3`; `lvrtc mtf nikkor-z50f12 --engines lv`.
- Phase 2: the same run with `--engines lv,ref,optiland`; expect hits ~2e-9 mm, path ~5e-6 waves, zero clip
  mismatches. Then `lvrtc baseline write` and `lvrtc verify`.
- Phase 3: `lvrtc mtf canon-ef-135-f2l-usm`; expect R4 ≤ 1e-7 and R5 within about 0.004.
  `lvrtc mtf nikkor-z50f12` must show ATTENTION rows, not FAIL.
- Phase 4: `lvrtc mtf nikkor-z50f12` shows the photopic best-axial three-way table with a class on every row;
  the validation-statement golden file matches.
- Phase 5: `lvrtc run suites/catalog.json --rungs r0,r1,r2,r3,r4 --jobs 4`.
- Phases 6–8: each stage's golden report section, conformance kit, or snapshot test as listed.
- Regression: with LV and optiland unconfigured, `lvrtc verify` validates baselines and regenerates every report
  byte-for-byte.
