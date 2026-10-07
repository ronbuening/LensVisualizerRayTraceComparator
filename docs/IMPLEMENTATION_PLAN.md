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
| R0 | Built-system echo: vertex z, sag at 9 radii per surface, indices, apertures, stop | direct | sag ≤ 1e-12 mm; rest bit-equal. Failure blocks later rungs |
| R1 | EFL, focal points, back focus from the last lens vertex, stop-derived entrance-pupil radius, pupil z | direct | 1e-9 mm |
| R2 | Per-surface hits, exit direction, image landing; clip mask | identical-rays | 1e-8 mm, 1e-9; 0 mismatches outside the rim band |
| R3 | Optical path to last surface and image; chief-relative OPD | identical-rays | 2e-5 waves |
| R4 | Binless geometric MTF, reference line and polychromatic, on rays valid in every engine | identical-rays | 1e-7 |
| R4f | Fidelity: comparator estimator on a replay of LV's own sampling vs `computeMtf` geometric | direct | 1e-9 (provisional) |
| R5 | LV product MTF vs engine-native MTF (first engine: `ScalarFFTMTF`) | independent | recorded; attention band 0.005 on axis / 0.01 off axis |
| R6 | Comparator wave OTF: on identical rays (a); vs LV's estimate (b); vs engine wavefront (c) | identical / independent | (a) gated, pinned at Stage 3.5 at 10× the measured maximum; (b), (c) recorded |

Statuses: PASS; FLOOR; FAIL; RECORDED; ATTENTION (recorded, outside its band; not a failure); UNSUPPORTED; STALE;
ERROR. **FLOOR** applies to R2/R3 only when every other engine agrees with `ref` within 1e-10 mm / 1e-7 waves
*and* |`lv` − `ref`| ≤ 1e-7 mm per hit and 2e-4 waves; otherwise FAIL. Classes, decided in order: unsupported,
data (inputs not identical), convention (a missing declared transform; a comparator bug), numerical, method.

## Phases and stages

Each stage is one commit. Every rung stage delivers its evaluator, policy entry and report section. Unit tests
are hermetic (synthetic fixtures, fake engines, `ref`). Integration tests need a configured LV path or optiland
interpreter and skip with a stated reason otherwise.

Suites: **benchmark** = the MTF plan's 11 lenses, 12 configurations (`nikon-z-24-70f4s` at both ends), all d-line
with even aspheres. **features** = one lens per translation path the benchmark lacks: odd asphere, e-line, mixed
d/e, A18/A20, flat-base asphere, authored rear-plate rim, fixed-iris zoom.

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

### Phase 2 — optiland adapter and ray-level parity (R0–R3)

Benchmark: `lvrtc run suites/benchmark.json --rungs r0,r1,r2,r3 --engines lv,ref,optiland` (and the feature
suite) passes every gated rung as PASS or FLOOR at six lines; `reports/benchmark/rays.md` committed; editing one
LV lens file flips that lens to STALE(case) and changing the optiland fingerprint flips its rows to STALE(engine).

| Stage | Deliver | Verify |
|---|---|---|
| 2.1 Worker skeleton | `lvrtc_optiland`: hello, capabilities, fingerprint (checkout sha + dirty, package source hash, Python/numpy/numba/scipy versions, JIT state); cache redirection; one timed FFT call | Conformance kit green; path + size + mtime snapshot of the optiland checkout identical before and after a JIT-enabled trace; no core module edited |
| 2.2 IR → Optic, R0 | Builder (even/odd asphere mapping, planes, apertures, stop, object, image plane); post-build echo re-read from the Optic; `docs/gotchas.md` started | `unittest` on fixtures; R0 on both suites; a deliberately shifted coefficient is caught and names the surface |
| 2.3 Paraxial, R1 | `paraxial.first-order` with reference conversions (image-relative → global; back focus from the last lens vertex) | R1 three-way `lv` / `ref` / `optiland` |
| 2.4 Rays, R2 | `rays.trace` via `RealRays` + `surfaces.trace`; intensity-mask validity; rim-band accounting | R2 three-way on both suites at every line, once with JIT on and once off |
| 2.5 Optical path, R3 | Path to last surface and image; comparator OPD re-referencing | R3 three-way on both suites |
| 2.6 Baselines and staleness | Baseline records; STALE(case) keyed on IR hash, STALE(engine) on fingerprint; `lvrtc baseline write/check` (OK / REFRESHABLE / DRIFT; non-zero exit only on DRIFT, FAIL or ERROR); hermetic `lvrtc verify` | CI validates baselines and regenerates reports byte-for-byte without LV or optiland; Double-Gauss optiland numbers replay against `ref` |

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
| 5.3 Catalog sweep | Sweep suite and statistics report | Sweep completes; report deterministic |
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
| R0, R4f, R6, FLOOR, the direction gate | Comparator additions; R4f and R6a tolerances provisional until measured |

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
- **optiland JIT**: on, cache under `.cache/`, once Stage 2.1 has timed it.
- **Second engine** (Stage 7.3): chosen when Phase 7 starts.

## Existing code reused

LV (`LensVisualizer/LensVisualizer/src/`, imported by path, read-only):

- `optics/buildLens.ts` (default export), `optics/compat.ts` — `prepareRuntimeState`, `traceEngineRay2`,
  `traceRay2`, `computeCardinalElements2`, `entrancePupilAtState2`, `createAnalysisComputationContext`
- `optics/apertureStop.ts` `wideOpenStopAtZoom`; `optics/trace/aperture.ts` `evaluateAperture`
- `optics/math/paraxial.ts` `traceParaxialSurfaces2`; `optics/first-order/cardinals.ts`
  `buildCardinalElementsFromMatrix2`; `optics/first-order/systemMatrix.ts`
- `optics/mtf.ts` `computeMtf`, `assessMtfSupport`, `resolveMtfSpectrum`
- `optics/analysis/mtfTracing.ts` `prepareMtfFieldLaunch`, `findMtfFieldFootprint`, `mtfLaunchGrid`,
  `mtfLaunchRay`, `traceMtfBundle`, `mtfImagePoint`, `mtfIndexResolver`, `mtfTraceOptions`
- `optics/analysis/mtf.ts` `refineMtfField`; `optics/analysis/mtfFootprint.ts` `expandMtfFootprint`;
  `optics/analysis/mtfMath.ts` `geometricOtf`, `combineOtfs`; `optics/analysis/mtfConstants.ts`
- `utils/state/mtfPreferences.ts` (tab defaults); source canaries on `components/display/analysis/MtfTab.tsx`,
  `components/hooks/useLensComputation.ts` and `optics/analysis/mtf.ts`

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
